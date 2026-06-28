/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OutfitCanvas from './components/OutfitCanvas';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import StylistBot from './components/StylistBot';
import SavedWardrobes from './components/SavedWardrobes';
import CheckoutPage from './components/CheckoutPage';
import OrderHistory from './components/OrderHistory';
import { Product, Outfit, CartItem, Order } from './types';

export default function App() {
  // Tabs: 'builder' (Criador), 'shop' (Loja), 'wardrobe' (Armário), 'orders' (Pedidos), 'checkout' (Finalizar Compra)
  const [currentTab, setCurrentTab] = useState<'builder' | 'shop' | 'wardrobe' | 'orders' | 'checkout'>('builder');

  // Equipped outfit composition slots state
  const [equippedOutfit, setEquippedOutfit] = useState<{
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  }>({});

  // Collections state (local storage backed)
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Drawer and Modal overlay toggle states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Initialize and load saved wardrobe compositions, shopping cart, and orders from localStorage on boot
  useEffect(() => {
    try {
      const storedOutfits = localStorage.getItem('alt_closet_outfits');
      if (storedOutfits) setSavedOutfits(JSON.parse(storedOutfits));

      const storedCart = localStorage.getItem('alt_closet_cart');
      if (storedCart) setCartItems(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem('alt_closet_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error('Error reading localStorage persistence:', e);
    }
  }, []);

  // Sync state back to local storage
  const syncOutfits = (newOutfits: Outfit[]) => {
    setSavedOutfits(newOutfits);
    localStorage.setItem('alt_closet_outfits', JSON.stringify(newOutfits));
  };

  const syncCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('alt_closet_cart', JSON.stringify(newCart));
  };

  const syncOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('alt_closet_orders', JSON.stringify(newOrders));
  };

  // Outfit builder hooks
  const setEquippedItem = (category: 'top' | 'bottom' | 'footwear' | 'accessory', item: Product | undefined) => {
    setEquippedOutfit((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  const clearActiveOutfit = () => {
    setEquippedOutfit({});
  };

  const saveOutfit = (name: string) => {
    const newOutfit: Outfit = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      items: { ...equippedOutfit },
      tags: (Object.values(equippedOutfit).filter(Boolean) as Product[]).map((p) => p.aesthetic),
      savedAt: new Date().toISOString(),
    };
    const updated = [newOutfit, ...savedOutfits];
    syncOutfits(updated);
  };

  const deleteOutfit = (id: string) => {
    const updated = savedOutfits.filter((o) => o.id !== id);
    syncOutfits(updated);
  };

  const loadOutfitToCanvas = (outfit: Outfit) => {
    setEquippedOutfit(outfit.items);
    setCurrentTab('builder');
  };

  // Cart operations hooks
  const addToCart = (product: Product, size: string) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    let updatedCart = [...cartItems];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        product,
        quantity: 1,
        selectedSize: size,
      });
    }

    syncCart(updatedCart);
    setIsCartOpen(true); // Open cart immediately to show addition feedback
  };

  const addAllToCart = (items: Record<string, Product | undefined>) => {
    let updatedCart = [...cartItems];

    Object.values(items).forEach((product) => {
      if (!product) return;
      const size = product.sizes[0] || 'T. ÚNICO';
      const existingIndex = updatedCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart.push({
          product,
          quantity: 1,
          selectedSize: size,
        });
      }
    });

    syncCart(updatedCart);
    setIsCartOpen(true);
  };

  const addActiveOutfitToCart = () => {
    addAllToCart(equippedOutfit);
  };

  const updateCartItemQuantity = (productId: string, size: string, qty: number) => {
    if (qty <= 0) return;
    const updated = cartItems.map((item) => {
      if (item.product.id === productId && item.selectedSize === size) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    syncCart(updated);
  };

  const removeCartItem = (productId: string, size: string) => {
    const updated = cartItems.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    syncCart(updated);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-[#39FF14] selection:text-black flex flex-col justify-between">
      {/* Premium Header/Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        openStylist={() => setIsStylistOpen(true)}
      />

      {/* Hero Header Promotional Section */}
      <div className="relative w-full border-b border-zinc-900 bg-zinc-950/40 overflow-hidden py-20 sm:py-28 flex items-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20 select-none pointer-events-none"
          poster="/images/alt_hero.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-soccer-ball-passing-between-players-on-the-field-34444-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <span className="font-mono text-4xs font-extrabold tracking-widest text-[#39FF14] uppercase bg-[#39FF14]/10 border border-[#39FF14]/20 px-2.5 py-1 rounded">
            ESTILO ALTERNATIVO DO UNDERGROUND
          </span>
          <h1 className="font-mono text-3xl font-black tracking-tighter text-white sm:text-6xl mt-4 uppercase">
            ALT-CLOSET
          </h1>
          <p className="mt-3 text-zinc-300 font-sans text-xs sm:text-sm max-w-xl leading-relaxed">
            Monte looks sagrados combinando camisas de times alternativos divididos por ligas:Brasileirão, Premier League, Ligue 1, Bundesliga, Seleções
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCurrentTab('shop')}
              className="px-4.5 py-2.5 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-xs font-black tracking-widest uppercase cursor-pointer transition-all hover:shadow-neon"
            >
              EXPLORAR CAMISAS
            </button>
            <button
              onClick={() => setCurrentTab('builder')}
              className="px-4.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-mono text-xs font-black tracking-widest uppercase cursor-pointer transition-all"
            >
              CRIAR LOOKS
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {currentTab === 'builder' && (
          <OutfitCanvas
            activeOutfit={equippedOutfit}
            setEquippedItem={setEquippedItem}
            clearActiveOutfit={clearActiveOutfit}
            saveOutfit={saveOutfit}
            addAllToCart={addActiveOutfitToCart}
            openProductDetail={setSelectedDetailProduct}
          />
        )}

        {currentTab === 'shop' && (
          <ProductGrid
            equippedOutfit={equippedOutfit}
            setEquippedItem={setEquippedItem}
            addToCart={addToCart}
            openProductDetail={setSelectedDetailProduct}
          />
        )}

        {currentTab === 'wardrobe' && (
          <SavedWardrobes
            savedOutfits={savedOutfits}
            deleteOutfit={deleteOutfit}
            loadOutfitToCanvas={loadOutfitToCanvas}
            addAllToCart={addAllToCart}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onBack={() => setCurrentTab('shop')}
            onSuccess={() => {
              // checkout page manages its own successful layout screen internally
            }}
            clearCart={clearCart}
            onPlaceOrder={(newOrder) => {
              syncOrders([newOrder, ...orders]);
            }}
            onViewOrders={() => setCurrentTab('orders')}
          />
        )}

        {currentTab === 'orders' && (
          <OrderHistory
            orders={orders}
            onBrowseShop={() => setCurrentTab('shop')}
            onUpdateOrderStatus={(orderId, newStatus) => {
              const updated = orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o);
              syncOrders(updated);
            }}
          />
        )}
      </main>

      {/* Floating Stylist Chat Trigger when closed */}
      {!isStylistOpen && (
        <button
          id="stylist-bot-launcher"
          onClick={() => setIsStylistOpen(true)}
          className="fixed bottom-6 right-6 z-45 flex h-12 w-12 items-center justify-center rounded-full bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/20 hover:bg-[#32e010] transition-all cursor-pointer animate-bounce-slow"
          aria-label="Abrir estilista pessoal ALT-BOT"
        >
          <span className="relative flex h-3 w-3 absolute top-0.5 right-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
          <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10a9.96 9.96 0 0 0 6.38-2.3l4.32 1.3-1.3-4.32A9.96 9.96 0 0 0 22 12a10 10 0 0 0-10-10Z" />
            <path d="M10 12h4m-4-3h4m-4 6h4" />
          </svg>
        </button>
      )}

      {/* Floating AI Stylist Bot Drawer */}
      <StylistBot
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        activeOutfit={equippedOutfit}
        setEquippedItem={setEquippedItem}
        addToCart={addToCart}
        openProductDetail={setSelectedDetailProduct}
      />

      {/* Requisition Cart slide-out drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateCartItemQuantity={updateCartItemQuantity}
        removeCartItem={removeCartItem}
        clearCart={clearCart}
        onCheckoutClick={() => setCurrentTab('checkout')}
      />

      {/* Expandable Product detail Modal view overlay */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          equippedOutfit={equippedOutfit}
          setEquippedItem={setEquippedItem}
          addToCart={addToCart}
        />
      )}

      {/* Subtle footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-5xs text-zinc-600 uppercase tracking-widest">
            © 2026 ALT-CLOSET. COMPRA TOTALMENTE SEGURA. LIGAS E SELEÇÕES ALTERNATIVAS. EM PARCERIA COM ORBITATCH.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setCurrentTab('builder')} className="font-mono text-5xs text-zinc-500 hover:text-white uppercase tracking-wider cursor-pointer">Criador de Looks</button>
            <button onClick={() => setCurrentTab('shop')} className="font-mono text-5xs text-zinc-500 hover:text-white uppercase tracking-wider cursor-pointer">Camisas de Time</button>
            <button onClick={() => setCurrentTab('wardrobe')} className="font-mono text-5xs text-zinc-500 hover:text-white uppercase tracking-wider cursor-pointer">Meu Armário</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
