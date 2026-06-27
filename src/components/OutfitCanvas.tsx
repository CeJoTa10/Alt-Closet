/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shirt, Sparkles, Plus, Trash2, Save, ShoppingCart, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data';

interface OutfitCanvasProps {
  activeOutfit: {
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  setEquippedItem: (category: 'top' | 'bottom' | 'footwear' | 'accessory', item: Product | undefined) => void;
  clearActiveOutfit: () => void;
  saveOutfit: (name: string) => void;
  addAllToCart: () => void;
  openProductDetail: (product: Product) => void;
}

export default function OutfitCanvas({
  activeOutfit,
  setEquippedItem,
  clearActiveOutfit,
  saveOutfit,
  addAllToCart,
  openProductDetail,
}: OutfitCanvasProps) {
  const [outfitName, setOutfitName] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'top' | 'accessory'>('top');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter available products for the quick selection drawer
  const rackProducts = INITIAL_PRODUCTS.filter((p) => p.category === selectedCategoryTab);

  // Calculate stats
  const selectedCount = Object.values(activeOutfit).filter(Boolean).length;
  const totalPrice = Object.values(activeOutfit).reduce((sum, item) => sum + (item ? item.price : 0), 0);

  // Vibe Analysis Algorithm translated
  const analyzeVibe = () => {
    const activeItems = Object.values(activeOutfit).filter(Boolean) as Product[];
    if (activeItems.length === 0) return 'Corpo Neutro';

    const aestheticCounts: Record<string, number> = {};
    activeItems.forEach((item) => {
      aestheticCounts[item.aesthetic] = (aestheticCounts[item.aesthetic] || 0) + 1;
    });

    let primaryAesthetic = '';
    let maxCount = 0;
    Object.entries(aestheticCounts).forEach(([aesthetic, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryAesthetic = aesthetic;
      }
    });

    const aestheticLabels: Record<string, string> = {
      gothic: 'Gótico Urbano',
      grunge: 'Indie Grunge',
      techwear: 'Tático Techwear',
      cyberpunk: 'Neon Cyberpunk',
    };

    const baseLabel = aestheticLabels[primaryAesthetic] || 'Alternativo';

    if (activeItems.length === 1) {
      return `${baseLabel} (Em Construção)`;
    }

    const uniqueAesthetics = Object.keys(aestheticCounts);
    if (uniqueAesthetics.length > 1) {
      return `Fusão ${baseLabel}`;
    }

    return `${baseLabel} Puro`;
  };

  const currentVibe = analyzeVibe();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfitName.trim() || selectedCount === 0) return;
    saveOutfit(outfitName.trim());
    setOutfitName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Visual Dressing Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 flex flex-col h-full min-h-[550px] justify-between relative overflow-hidden">
          {/* Neon green ambient light glow in backgrounds */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#39FF14]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Canvas Header */}
          <div className="flex justify-between items-center z-10 border-b border-zinc-900 pb-4">
            <div>
              <h2 className="font-mono text-base font-bold text-white tracking-wider flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-neon" />
                LOOK ATIVO NO PAINEL
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Vibe Atual: <span className="text-neon font-bold">{currentVibe}</span>
              </p>
            </div>
            {selectedCount > 0 && (
              <button
                onClick={clearActiveOutfit}
                className="flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-neon transition-colors py-1 px-2 rounded hover:bg-zinc-900 cursor-pointer"
                title="Limpar look atual"
              >
                <RefreshCw className="h-3 w-3" />
                LIMPAR
              </button>
            )}
          </div>

          {/* The Layered Slots Assembly */}
          <div className="my-8 flex flex-col md:flex-row items-center justify-center gap-6 z-10">
            {/* Visual Assembly Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              {/* Top Slot */}
              <div className={`rounded-xl border p-4 flex flex-col justify-between h-40 transition-all duration-300 ${
                activeOutfit.top 
                  ? 'border-[#39FF14]/40 bg-zinc-900/40 shadow-neon' 
                  : 'border-zinc-850 bg-zinc-900/10 hover:border-zinc-700 border-dashed'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-2xs font-bold text-zinc-500 tracking-wider">01 / CAMISA</span>
                  {activeOutfit.top && (
                    <button
                      onClick={() => setEquippedItem('top', undefined)}
                      className="text-zinc-500 hover:text-neon p-1 rounded hover:bg-zinc-900 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {activeOutfit.top ? (
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={activeOutfit.top.image}
                      alt={activeOutfit.top.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-zinc-800 cursor-pointer hover:border-[#39FF14] transition-colors"
                      onClick={() => openProductDetail(activeOutfit.top!)}
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-sans text-xs font-semibold text-white truncate">{activeOutfit.top.name}</h4>
                      <p className="font-mono text-2xs text-neon mt-0.5">R$ {activeOutfit.top.price.toFixed(2)}</p>
                      {activeOutfit.top.league && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-4xs font-mono bg-[#39FF14]/10 text-neon uppercase tracking-widest mt-1 mr-1">
                          {activeOutfit.top.league.replace('_', ' ')}
                        </span>
                      )}
                      <span className="inline-block px-1.5 py-0.5 rounded text-3xs font-mono bg-zinc-800 text-zinc-400 uppercase tracking-widest mt-1">
                        {activeOutfit.top.aesthetic}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedCategoryTab('top')}
                    className="flex flex-col items-center justify-center py-4 text-zinc-650 hover:text-zinc-400 transition-colors h-24 cursor-pointer"
                  >
                    <Plus className="h-6 w-6 stroke-1 mb-1" />
                    <span className="font-mono text-2xs tracking-widest">EQUIPAR CAMISA</span>
                  </button>
                )}
              </div>

              {/* Accessory Slot */}
              <div className={`rounded-xl border p-4 flex flex-col justify-between h-40 transition-all duration-300 ${
                activeOutfit.accessory 
                  ? 'border-[#39FF14]/40 bg-zinc-900/40 shadow-neon' 
                  : 'border-zinc-850 bg-zinc-900/10 hover:border-zinc-700 border-dashed'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-2xs font-bold text-zinc-500 tracking-wider">02 / ACESSÓRIO</span>
                  {activeOutfit.accessory && (
                    <button
                      onClick={() => setEquippedItem('accessory', undefined)}
                      className="text-zinc-500 hover:text-neon p-1 rounded hover:bg-zinc-900 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {activeOutfit.accessory ? (
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={activeOutfit.accessory.image}
                      alt={activeOutfit.accessory.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-zinc-800 cursor-pointer hover:border-[#39FF14] transition-colors"
                      onClick={() => openProductDetail(activeOutfit.accessory!)}
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-sans text-xs font-semibold text-white truncate">{activeOutfit.accessory.name}</h4>
                      <p className="font-mono text-2xs text-neon mt-0.5">R$ {activeOutfit.accessory.price.toFixed(2)}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-3xs font-mono bg-zinc-800 text-zinc-400 uppercase tracking-widest mt-1">
                        {activeOutfit.accessory.aesthetic}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedCategoryTab('accessory')}
                    className="flex flex-col items-center justify-center py-4 text-zinc-650 hover:text-zinc-400 transition-colors h-24 cursor-pointer"
                  >
                    <Plus className="h-6 w-6 stroke-1 mb-1" />
                    <span className="font-mono text-2xs tracking-widest">EQUIPAR ACESSÓRIO</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Canvas Footer Actions */}
          <div className="border-t border-zinc-900 pt-5 z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center font-mono text-xs text-zinc-400">
              <span>VALOR DO CONJUNTO</span>
              <span className="text-lg font-bold text-neon tracking-widest font-mono">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>

            {selectedCount > 0 ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSave} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="NOMEIE ESTE LOOK..."
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Salvar no armário local"
                  >
                    <Save className="h-4 w-4" />
                    SALVAR
                  </button>
                </form>

                <button
                  onClick={addAllToCart}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-neon cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  COMPRAR LOOK
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-zinc-500 bg-zinc-900/20 p-3 rounded-lg border border-zinc-900/50">
                <Shirt className="h-4 w-4 flex-shrink-0" />
                <span className="font-mono text-3xs tracking-wider uppercase">
                  Selecione e monte itens das ligas e categorias no cabide para estruturar seu look alternativo.
                </span>
              </div>
            )}

            {saveSuccess && (
              <div className="text-3xs font-mono text-black bg-[#39FF14] text-center uppercase tracking-widest py-1.5 rounded font-bold shadow-neon">
                LOOK SALVO COM SUCESSO NO SEU ARMÁRIO!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Rack Drawer (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 flex flex-col h-full min-h-[550px] justify-between">
          <div className="flex flex-col gap-4 h-full">
            {/* Header with quick categories */}
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-widest">
                CABIDE E COLECIONÁVEIS
              </h3>
              <p className="text-3xs text-zinc-500 font-mono mt-0.5 uppercase">
                Filtre por tipo de peça e equipe instantaneamente no boneco
              </p>
            </div>

            {/* Category selection bar */}
            <div className="flex border-b border-zinc-900 py-2 justify-start gap-4">
              {(['top', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`font-mono text-2xs tracking-widest px-3 py-1.5 rounded-md transition-colors uppercase cursor-pointer ${
                    selectedCategoryTab === cat
                      ? 'bg-zinc-900 text-neon font-bold border border-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {cat === 'top' ? 'Camisas' : 'Acessórios'}
                </button>
              ))}
            </div>

            {/* Dynamic Rack Products */}
            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-3 custom-scrollbar mt-2">
              {rackProducts.map((product) => {
                const isEquipped = activeOutfit[product.category]?.id === product.id;
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isEquipped
                        ? 'border-[#39FF14]/30 bg-[#39FF14]/5'
                        : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 hover:bg-zinc-900/50'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-zinc-850 cursor-pointer"
                      onClick={() => openProductDetail(product)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans text-xs font-semibold text-white truncate hover:text-neon cursor-pointer" onClick={() => openProductDetail(product)}>
                        {product.name}
                      </h4>
                      <p className="font-mono text-2xs text-neon mt-0.5 font-bold">R$ {product.price.toFixed(2)}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {product.league && (
                          <span className="px-1.5 py-0.5 rounded text-5xs font-mono bg-[#39FF14]/10 text-neon uppercase tracking-widest font-bold">
                            {product.league.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {isEquipped ? (
                        <button
                          onClick={() => setEquippedItem(product.category, undefined)}
                          className="px-2.5 py-1.5 rounded border border-[#39FF14]/30 text-neon font-mono text-3xs hover:bg-[#39FF14]/10 transition-all cursor-pointer"
                        >
                          REMOVER
                        </button>
                      ) : (
                        <button
                          onClick={() => setEquippedItem(product.category, product)}
                          className="px-2.5 py-1.5 rounded border border-zinc-800 text-zinc-300 hover:text-white font-mono text-3xs hover:border-[#39FF14]/30 hover:text-neon transition-all cursor-pointer"
                        >
                          EQUIPAR
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
