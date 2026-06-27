/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Shirt, ShoppingBag, Plus } from 'lucide-react';
import { Message, Product } from '../types';
import { INITIAL_PRODUCTS } from '../data';

interface StylistBotProps {
  isOpen: boolean;
  onClose: () => void;
  activeOutfit: {
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  setEquippedItem: (category: 'top' | 'bottom' | 'footwear' | 'accessory', item: Product | undefined) => void;
  addToCart: (product: Product, size: string) => void;
  openProductDetail: (product: Product) => void;
}

export default function StylistBot({
  isOpen,
  onClose,
  activeOutfit,
  setEquippedItem,
  addToCart,
  openProductDetail,
}: StylistBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'stylist',
      text: 'Olá! Sou o ALT-BOT, seu estilista inteligente de futebol e moda underground. Posso te ajudar a avaliar seu visual, sugerir camisas de times das ligas (Brasileirão, Premier League, Ligue 1, Bundesliga ou Seleções) e propor excelentes combinações com acessórios, calças ou tênis alternativos. Monte seu look no **PAINEL DE LOOK ATIVO** e peça para eu avaliar. Qual estilo você quer projetar hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          activeOutfit,
        }),
      });

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: 'stylist',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: data.recommendedProductIds || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Stylist API Error:', error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: 'stylist',
        text: 'Desculpe. A rede de estilo inteligente está indisponível ou offline. Por favor, verifique se a sua chave de API do Gemini está configurada corretamente nos segredos da aplicação.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handlePreset = (preset: string) => {
    handleSend(preset);
  };

  // Helper to map recommended product IDs to actual products
  const getRecommendedProducts = (ids?: string[]): Product[] => {
    if (!ids || ids.length === 0) return [];
    return INITIAL_PRODUCTS.filter((p) => ids.includes(p.id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-full max-w-md flex-col rounded-2xl border border-zinc-850 bg-zinc-950 shadow-2xl overflow-hidden animate-scale-up">
      {/* Bot Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-neon" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              ESTILISTA PESSOAL ALT-BOT
            </h3>
            <p className="text-4xs text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
              CONECTADO COM GEMINI AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full border border-zinc-900 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950"
      >
        {messages.map((m) => {
          const recommendedItems = getRecommendedProducts(m.recommendedProducts);
          return (
            <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-4xs font-bold uppercase tracking-wider text-zinc-500">
                  {m.sender === 'user' ? 'Entidade (Você)' : 'ALT-BOT'}
                </span>
                <span className="font-mono text-5xs text-zinc-650">{m.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed break-words ${
                  m.sender === 'user'
                    ? 'bg-[#39FF14] text-black font-semibold rounded-tr-none shadow-neon'
                    : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-850'
                }`}
              >
                {/* Standard markdown-like parsing for bold text */}
                {m.text.split('\n').map((paragraph, pIdx) => {
                  // Basic formatting for markdown **text**
                  const parts = paragraph.split('**');
                  return (
                    <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                      {parts.map((part, partIdx) => 
                        partIdx % 2 === 1 ? <strong key={partIdx} className={m.sender === 'user' ? 'text-black font-extrabold' : 'text-white font-extrabold'}>{part}</strong> : part
                      )}
                    </p>
                  );
                })}
              </div>

              {/* Recommended items overlay inline */}
              {recommendedItems.length > 0 && (
                <div className="mt-3 w-full max-w-[85%] space-y-2">
                  <p className="font-mono text-4xs font-bold text-neon tracking-widest uppercase mb-1">
                    PEÇAS RECOMENDADAS:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-zinc-850 bg-zinc-900/40 text-left"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-800 flex-shrink-0 cursor-pointer"
                          onClick={() => openProductDetail(item)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => openProductDetail(item)}
                            className="font-sans text-3xs font-bold text-white truncate hover:text-neon cursor-pointer uppercase tracking-wide"
                          >
                            {item.name}
                          </h4>
                          <p className="font-mono text-4xs text-neon mt-0.5 font-bold">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEquippedItem(item.category, item)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Equipar esta peça no visual"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => addToCart(item, item.sizes[0] || 'T. ÚNICO')}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Adicionar ao carrinho"
                          >
                            <ShoppingBag className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="font-mono text-4xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              ALT-BOT
            </span>
            <div className="rounded-2xl rounded-tl-none bg-zinc-900 px-3.5 py-2.5 text-xs font-sans text-zinc-500 border border-zinc-900 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14]/75 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
              </span>
              FORMULANDO SUGESTÕES DE ESTILO...
            </div>
          </div>
        )}
      </div>

      {/* Preset Fast Actions */}
      <div className="border-t border-zinc-900 bg-zinc-950 px-4 py-2.5 flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar shrink-0">
        <button
          onClick={() => handlePreset('Avalie o meu look montado')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 font-mono text-4xs text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
        >
          AVALIAR MEU LOOK
        </button>
        <button
          onClick={() => handlePreset('Sugira uma combinação perfeita com camisas do Brasileirão')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 font-mono text-4xs text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
        >
          COMBINAÇÕES BRASILEIRÃO
        </button>
        <button
          onClick={() => handlePreset('Me dê ideias de estilo alternativo Cyberpunk')}
          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 font-mono text-4xs text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
        >
          ESTILO CYBERPUNK
        </button>
      </div>

      {/* Chat Input form */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-900 bg-zinc-950 p-3 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="DIGITE SUAS PREFERÊNCIAS DE ESTILO..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-zinc-850 bg-zinc-900 px-3 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer shadow-neon"
          aria-label="Enviar mensagem"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
