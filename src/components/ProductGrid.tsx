/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { Search, SlidersHorizontal, Check, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data';

interface ProductGridProps {
  equippedOutfit: {
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  setEquippedItem: (category: 'top' | 'bottom' | 'footwear' | 'accessory', item: Product | undefined) => void;
  addToCart: (product: Product, size: string) => void;
  openProductDetail: (product: Product) => void;
}

export default function ProductGrid({
  equippedOutfit,
  setEquippedItem,
  addToCart,
  openProductDetail,
}: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');

  // Filter products
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    // Only allow 'top' and 'accessory'
    if (product.category !== 'top' && product.category !== 'accessory') {
      return false;
    }
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAesthetic = selectedAesthetic === 'all' || product.aesthetic === selectedAesthetic;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLeague = selectedLeague === 'all' || product.league === selectedLeague;
    return matchesSearch && matchesAesthetic && matchesCategory && matchesLeague;
  });

  const leaguesList = [
    { id: 'all', label: 'Todas as Ligas' },
    { id: 'brasileirao', label: 'Brasileirão' },
    { id: 'premier_league', label: 'Premier League' },
    { id: 'ligue_1', label: 'Ligue 1' },
    { id: 'bundesliga', label: 'Bundesliga' },
    { id: 'selecoes', label: 'Seleções' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* League Selection Tabs (User requested separation by league) */}
      <div className="border-b border-zinc-900 pb-2">
        <span className="font-mono text-4xs font-extrabold tracking-widest text-neon uppercase block mb-3">
          SELECIONE A LIGA DA CAMISA
        </span>
        <div className="flex flex-wrap gap-2">
          {leaguesList.map((lg) => (
            <button
              key={lg.id}
              onClick={() => setSelectedLeague(lg.id)}
              className={`px-4 py-2 rounded-xl font-mono text-2xs font-bold tracking-wider transition-all duration-200 uppercase cursor-pointer ${
                selectedLeague === lg.id
                  ? 'bg-[#39FF14] text-black shadow-neon'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-700'
              }`}
            >
              {lg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Header controls */}
      <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="BUSCAR CAMISAS DE TIME E ACESSÓRIOS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650 uppercase"
          />
        </div>

        {/* Filters Quick bar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-1.5 px-2 py-2 text-zinc-500 font-mono text-3xs tracking-widest uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            FILTRAR:
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 font-mono text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] uppercase cursor-pointer"
          >
            <option value="all">TODAS AS CATEGORIAS</option>
            <option value="top">CAMISAS</option>
            <option value="accessory">ACESSÓRIOS</option>
          </select>

          <select
            value={selectedAesthetic}
            onChange={(e) => setSelectedAesthetic(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 font-mono text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] uppercase cursor-pointer"
          >
            <option value="all">TODOS OS ESTILOS</option>
            <option value="gothic">GÓTICO</option>
            <option value="techwear">TECHWEAR</option>
            <option value="grunge">GRUNGE</option>
            <option value="cyberpunk">CYBERPUNK</option>
          </select>
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isEquipped = equippedOutfit[product.category]?.id === product.id;
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-850 bg-zinc-950 p-4 hover:border-[#39FF14]/50 hover:shadow-neon duration-300 transition-all shadow-neon-hover"
              >
                {/* Product Image Panel */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-zinc-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Aesthetic Badge Overlay */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-zinc-950/90 border border-zinc-800 font-mono text-4xs font-bold text-white uppercase tracking-widest backdrop-blur-xs">
                    {product.aesthetic}
                  </span>

                  {/* League Badge Overlay if exists */}
                  {product.league && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-[#39FF14] font-mono text-4xs font-bold text-black uppercase tracking-widest">
                      {product.league.replace('_', ' ')}
                    </span>
                  )}

                  {/* Rating Badge Overlay */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-800 font-mono text-4xs font-bold text-neon backdrop-blur-xs">
                    {product.rating} ★
                  </span>
                </div>

                {/* Info and Purchase Grid */}
                <div className="mt-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => openProductDetail(product)}
                      className="font-sans text-sm font-bold text-white hover:text-neon transition-colors cursor-pointer line-clamp-1 uppercase"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="font-mono text-xs text-neon font-extrabold">
                        R$ {product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="font-mono text-4xs text-zinc-600 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </p>
                      )}
                      {product.originalPrice && (
                        <span className="text-[8px] px-1 rounded bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] font-mono font-bold tracking-wider">
                          PROMO
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs font-sans mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-900">
                    {isEquipped ? (
                      <button
                        onClick={() => setEquippedItem(product.category, undefined)}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-[#39FF14]/30 bg-[#39FF14]/5 text-neon font-mono text-4xs font-bold transition-all cursor-pointer hover:bg-[#39FF14]/10"
                      >
                        <Check className="h-3 w-3" />
                        EQUIPADO
                      </button>
                    ) : (
                      <button
                        onClick={() => setEquippedItem(product.category, product)}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-zinc-850 hover:border-zinc-700 text-zinc-350 font-mono text-4xs font-bold transition-all cursor-pointer hover:bg-zinc-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        MONTAR LOOK
                      </button>
                    )}

                    <button
                      onClick={() => addToCart(product, product.sizes[0] || 'T. ÚNICO')}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-mono text-4xs font-bold transition-all cursor-pointer hover:border-[#39FF14]/30 hover:text-neon"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      COMPRAR
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-850 border-dashed bg-zinc-950/20 py-16 px-4 flex flex-col items-center justify-center text-center">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            NENHUM PRODUTO ENCONTRADO PARA OS PARÂMETROS SELECIONADOS
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedAesthetic('all');
              setSelectedCategory('all');
              setSelectedLeague('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg border border-zinc-800 hover:border-[#39FF14]/40 bg-zinc-900 text-white font-mono text-xs transition-colors cursor-pointer"
          >
            RESTAURAR FILTROS
          </button>
        </div>
      )}
    </div>
  );
}
