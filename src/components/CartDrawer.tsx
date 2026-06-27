/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, Ticket, ShoppingCart, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateCartItemQuantity: (productId: string, size: string, qty: number) => void;
  removeCartItem: (productId: string, size: string) => void;
  clearCart: () => void;
  onCheckoutClick: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  onCheckoutClick,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  if (!isOpen) return null;

  // Total calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 400 || subtotal === 0 ? 0 : 35.00;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ALT10') {
      setIsPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    }
  };

  const handleCheckout = () => {
    setCheckoutStep('checkout');
    setTimeout(() => {
      setCheckoutStep('success');
      clearCart();
    }, 2000); // Simulate processing
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-zinc-950 border-l border-zinc-900 h-full flex flex-col justify-between p-6 shadow-2xl relative animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-neon" />
            <h2 className="font-mono text-sm font-bold tracking-widest text-white uppercase">
              MEU CARRINHO ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full border border-zinc-900 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar carrinho"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4 custom-scrollbar">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${idx}`}
                  className="flex gap-4 p-3 rounded-xl border border-zinc-900 bg-zinc-900/20"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-zinc-850"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-sans text-xs font-bold text-white truncate pr-2 uppercase">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeCartItem(item.product.id, item.selectedSize)}
                          className="text-zinc-650 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-3xs font-mono text-zinc-500 uppercase">
                        <span>Tam: <span className="text-zinc-350">{item.selectedSize}</span></span>
                        <span>•</span>
                        <span>Unit: <span className="text-neon">R$ {item.product.price.toFixed(2)}</span></span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded">
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-0.5 text-zinc-500 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-2 py-0.5 text-zinc-500 hover:text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-xs text-white font-bold">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center gap-3">
                <ShoppingBag className="h-10 w-10 text-zinc-700 stroke-1" />
                <p className="font-mono text-3xs text-zinc-500 uppercase tracking-widest leading-relaxed">
                  SEU CARRINHO DE AQUISIÇÕES ESTÁ VAZIO.<br />EQUIPE ITENS E CONFIRME SEU LOOK.
                </p>
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'checkout' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative flex items-center justify-center h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-20"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14]"></span>
            </div>
            <div>
              <p className="font-mono text-xs text-white uppercase tracking-widest font-bold">
                PROCESSANDO TRANSAÇÃO SEGURA
              </p>
              <p className="text-3xs text-zinc-500 font-mono mt-1 uppercase">
                transmitindo dados criptografados para o cofre seguro...
              </p>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] shadow-neon">
              <ShieldCheck className="h-6 w-6 animate-scale" />
            </div>
            <div>
              <p className="font-mono text-xs text-[#39FF14] uppercase tracking-widest font-bold text-neon">
                TRANSAÇÃO AUTORIZADA
              </p>
              <p className="text-3xs text-zinc-400 font-mono mt-1.5 uppercase max-w-xs mx-auto leading-relaxed">
                Pedido processado com sucesso! Seu manto alternativo está sendo preparado com todo cuidado para envio. Acompanhe a logística no seu e-mail cadastrado.
              </p>
            </div>
            <button
              onClick={() => {
                setCheckoutStep('cart');
                onClose();
              }}
              className="mt-4 px-4 py-2 rounded-lg border border-zinc-800 hover:border-[#39FF14]/40 bg-zinc-900 text-white font-mono text-xs transition-colors cursor-pointer hover:shadow-neon"
            >
              CONTINUAR COMPRANDO
            </button>
          </div>
        )}

        {/* Drawer Footer Calculations */}
        {checkoutStep === 'cart' && (
          <div className="border-t border-zinc-900 pt-4 space-y-4">
            {/* Promo Input Panel */}
            {cartItems.length > 0 && (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="DIGITAR CUPOM (ALT10)..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isPromoApplied}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 pl-9 pr-3 py-2 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPromoApplied || !promoCode.trim()}
                  className="px-3 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 font-mono text-2xs uppercase tracking-wider hover:border-[#39FF14]/40 disabled:opacity-50 cursor-pointer hover:text-neon"
                >
                  APLICAR
                </button>
              </form>
            )}

            {isPromoApplied && (
              <div className="text-3xs font-mono text-[#39FF14] uppercase tracking-widest bg-[#39FF14]/10 border border-[#39FF14]/20 py-1 px-2.5 rounded flex justify-between items-center shadow-neon">
                <span>CUPOM ALINHADO: 10% DE DESCONTO</span>
                <span>-10%</span>
              </div>
            )}
            {promoError && (
              <div className="text-3xs font-mono text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 py-1 px-2.5 rounded text-center">
                CHAVE DE DESCONTO INVÁLIDA OU EXPIRADA
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 font-mono text-2xs text-zinc-400">
              <div className="flex justify-between">
                <span>SUBTOTAL DO PEDIDO</span>
                <span className="text-zinc-200 font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-[#39FF14]">
                  <span>DESCONTO DE CUPOM (10%)</span>
                  <span>-R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>LOGÍSTICA E ENTREGA (FRETE)</span>
                <span className="text-zinc-200 font-medium">
                  {shipping === 0 ? 'GRATUITO' : `R$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-3xs text-zinc-500 leading-none">
                  *FRETE GRÁTIS PARA COMPRAS ACIMA DE R$ 400,00
                </p>
              )}
              <div className="flex justify-between border-t border-zinc-900 pt-3 text-sm text-white font-bold tracking-widest">
                <span>TOTAL FINAL</span>
                <span className="text-neon">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* checkout Button */}
            {cartItems.length > 0 ? (
              <button
                onClick={() => {
                  onClose();
                  onCheckoutClick();
                }}
                className="w-full py-3 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-neon"
              >
                <ShieldCheck className="h-4 w-4" />
                FECHAR PEDIDO SEGURO
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-zinc-900 text-zinc-650 font-mono text-xs font-bold tracking-widest uppercase border border-zinc-900 cursor-not-allowed"
              >
                CARRINHO VAZIO
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
