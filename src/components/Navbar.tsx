/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Sparkles, FolderHeart, Shirt, ClipboardList } from 'lucide-react';

interface NavbarProps {
  currentTab: 'builder' | 'shop' | 'wardrobe' | 'orders' | 'checkout';
  setCurrentTab: (tab: 'builder' | 'shop' | 'wardrobe' | 'orders' | 'checkout') => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  openStylist: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cartCount,
  setIsCartOpen,
  openStylist,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-850 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 select-none">
          <Shirt className="h-6 w-6 text-neon" style={{ color: '#39FF14' }} />
          <span className="font-mono text-xl font-black tracking-widest text-white sm:text-2xl text-neon">
            ALT-CLOSET
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            id="nav-tab-builder"
            onClick={() => setCurrentTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 cursor-pointer ${
              currentTab === 'builder'
                ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            CRIADOR DE LOOKS
          </button>
          <button
            id="nav-tab-shop"
            onClick={() => setCurrentTab('shop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 cursor-pointer ${
              currentTab === 'shop'
                ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            COLEÇÃO DE CAMISAS
          </button>
          <button
            id="nav-tab-wardrobe"
            onClick={() => setCurrentTab('wardrobe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 cursor-pointer ${
              currentTab === 'wardrobe'
                ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <FolderHeart className="h-4 w-4" />
            LOOKS SALVOS
          </button>
          <button
            id="nav-tab-orders"
            onClick={() => setCurrentTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 cursor-pointer ${
              currentTab === 'orders'
                ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            PEDIDOS
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick AI Stylist Button */}
          <button
            id="navbar-stylist-btn"
            onClick={openStylist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10 text-neon font-mono text-xs hover:bg-[#39FF14]/20 transition-all duration-250 cursor-pointer shadow-neon"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
            </span>
            ESTILISTA ALT-BOT
          </button>

          {/* Cart Icon */}
          <button
            id="navbar-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-[#39FF14]/50 hover:shadow-neon transition-all duration-200 cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#39FF14] font-mono text-2xs font-bold text-black shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden border-t border-zinc-900 bg-zinc-950/90 py-1.5 px-2 items-center justify-around">
        <button
          onClick={() => setCurrentTab('builder')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-mono transition-colors cursor-pointer ${
            currentTab === 'builder' ? 'text-neon font-bold' : 'text-zinc-400'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>CRIADOR</span>
        </button>
        <button
          onClick={() => setCurrentTab('shop')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-mono transition-colors cursor-pointer ${
            currentTab === 'shop' ? 'text-neon font-bold' : 'text-zinc-400'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>LOJA</span>
        </button>
        <button
          onClick={() => setCurrentTab('wardrobe')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-mono transition-colors cursor-pointer ${
            currentTab === 'wardrobe' ? 'text-neon font-bold' : 'text-zinc-400'
          }`}
        >
          <FolderHeart className="h-4 w-4" />
          <span>ARMÁRIO</span>
        </button>
        <button
          onClick={() => setCurrentTab('orders')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-mono transition-colors cursor-pointer ${
            currentTab === 'orders' ? 'text-neon font-bold' : 'text-zinc-400'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>PEDIDOS</span>
        </button>
      </div>
    </header>
  );
}
