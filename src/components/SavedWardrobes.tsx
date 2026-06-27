/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2, ShoppingCart, Sparkles, FolderHeart } from 'lucide-react';
import { Outfit, Product } from '../types';

interface SavedWardrobesProps {
  savedOutfits: Outfit[];
  deleteOutfit: (id: string) => void;
  loadOutfitToCanvas: (outfit: Outfit) => void;
  addAllToCart: (items: Record<string, Product | undefined>) => void;
}

export default function SavedWardrobes({
  savedOutfits,
  deleteOutfit,
  loadOutfitToCanvas,
  addAllToCart,
}: SavedWardrobesProps) {
  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8 flex flex-col h-full min-h-[500px]">
      <div className="border-b border-zinc-900 pb-4 mb-6">
        <h2 className="font-mono text-base font-bold text-white tracking-wider flex items-center gap-2">
          <FolderHeart className="h-5 w-5 text-neon" />
          SEUS LOOKS SALVOS
        </h2>
        <p className="text-xs text-zinc-500 font-mono mt-0.5 uppercase">
          Revise, equipe ou compre suas combinações alternativas de camisas de times e acessórios
        </p>
      </div>

      {savedOutfits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedOutfits.map((outfit) => {
            const outfitItems = Object.values(outfit.items).filter(Boolean) as Product[];
            const totalPrice = outfitItems.reduce((sum, item) => sum + item.price, 0);

            return (
              <div
                key={outfit.id}
                className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex flex-col justify-between hover:border-[#39FF14]/30 hover:shadow-neon transition-all"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide">
                        {outfit.name}
                      </h3>
                      <p className="font-mono text-4xs text-zinc-500 uppercase mt-0.5">
                        Arquivado em: {new Date(outfit.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteOutfit(outfit.id)}
                      className="text-zinc-650 hover:text-red-400 p-1.5 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                      title="Excluir composição"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Items miniature display list */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    {(['top', 'accessory'] as const).map((cat) => {
                      const item = outfit.items[cat];
                      return (
                        <div
                          key={cat}
                          className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30 border border-zinc-900/50"
                        >
                          {item ? (
                            <>
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded object-cover border border-zinc-850"
                              />
                              <div className="overflow-hidden">
                                <p className="font-sans text-4xs font-bold text-white truncate uppercase">
                                  {item.name}
                                </p>
                                <p className="font-mono text-5xs text-neon font-bold">R$ {item.price.toFixed(2)}</p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-1.5 py-1 text-zinc-650">
                              <span className="h-6 w-6 rounded border border-zinc-900 border-dashed flex items-center justify-center text-4xs font-mono font-bold">
                                ø
                              </span>
                              <span className="font-mono text-5xs uppercase tracking-wider">{cat === 'top' ? 'Camisa' : 'Acessório'}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wardrobe stats and actions */}
                <div className="border-t border-zinc-900 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex flex-col items-start w-full sm:w-auto">
                    <span className="font-mono text-5xs text-zinc-500 uppercase tracking-widest">Investimento do Look</span>
                    <span className="font-mono text-sm font-bold text-white">R$ {totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => loadOutfitToCanvas(outfit)}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-3xs font-bold tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      MONTAR LOOK
                    </button>
                    <button
                      onClick={() => addAllToCart(outfit.items)}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-3xs font-bold tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-neon"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      COMPRAR O CONJUNTO
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-3 border border-zinc-900 border-dashed rounded-xl bg-zinc-950/20">
          <FolderHeart className="h-8 w-8 text-zinc-700 stroke-1" />
          <p className="font-mono text-3xs text-zinc-500 uppercase tracking-widest leading-relaxed">
            NENHUM LOOK ARQUIVADO NO SEU PORTFÓLIO AINDA.<br />MONTE CONJUNTOS NO CRIADOR E SALVE-OS PARA VISUALIZAR AQUI.
          </p>
        </div>
      )}
    </div>
  );
}
