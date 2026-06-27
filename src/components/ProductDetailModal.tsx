/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Check, ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  equippedOutfit: {
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  setEquippedItem: (category: 'top' | 'bottom' | 'footwear' | 'accessory', item: Product | undefined) => void;
  addToCart: (product: Product, size: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  equippedOutfit,
  setEquippedItem,
  addToCart,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'T. ÚNICO');
  const isEquipped = equippedOutfit[product.category]?.id === product.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full border border-zinc-900 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Left: Product Image */}
          <div className="aspect-square rounded-xl overflow-hidden border border-zinc-900 bg-zinc-900 relative">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-2 py-1 rounded bg-zinc-950/90 border border-zinc-800 font-mono text-4xs font-bold text-white uppercase tracking-widest">
              {product.aesthetic}
            </span>
            {product.league && (
              <span className="absolute top-3 right-3 px-2 py-1 rounded bg-[#39FF14] font-mono text-4xs font-bold text-black uppercase tracking-widest">
                {product.league.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Right: Technical Specs & Description */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="font-mono text-4xs tracking-widest text-zinc-500 uppercase">ESPECIFICAÇÕES DA PEÇA</span>
              <h2 className="font-sans text-xl font-extrabold text-white mt-1 uppercase tracking-wide">
                {product.name}
              </h2>
              <div className="flex items-center gap-2.5 mt-1">
                <p className="font-mono text-base font-bold text-neon">R$ {product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="font-mono text-xs text-zinc-650 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </p>
                )}
                {product.originalPrice && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] font-mono font-bold tracking-wider">
                    VALOR PROMOCIONAL
                  </span>
                )}
              </div>
              
              <div className="mt-4 border-t border-zinc-900 pt-4">
                <h4 className="font-mono text-3xs text-zinc-500 uppercase tracking-widest">Descrição</h4>
                <p className="text-zinc-400 text-xs font-sans mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Features */}
              <div className="mt-4">
                <h4 className="font-mono text-3xs text-zinc-500 uppercase tracking-widest">DETALHES DA PEÇA</h4>
                <ul className="mt-1.5 space-y-1">
                  {product.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-3xs font-mono text-zinc-400 uppercase tracking-wide">
                      <span className="text-[#39FF14] mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <h4 className="font-mono text-3xs text-zinc-500 uppercase tracking-widest">SELECIONE O TAMANHO</h4>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-2xs transition-all uppercase cursor-pointer ${
                        selectedSize === size
                          ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                          : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-white hover:border-zinc-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-zinc-900">
              {isEquipped ? (
                <button
                  onClick={() => {
                    setEquippedItem(product.category, undefined);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[#39FF14]/30 bg-[#39FF14]/5 text-neon font-mono text-xs transition-colors cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  EQUIPADO
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEquippedItem(product.category, product);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  MONTAR LOOK
                </button>
              )}

              <button
                onClick={() => {
                  addToCart(product, selectedSize);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-neon"
              >
                <ShoppingBag className="h-4 w-4" />
                COMPRAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
