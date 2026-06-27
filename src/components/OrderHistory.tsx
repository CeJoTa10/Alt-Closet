/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Calendar, CreditCard, QrCode, FileText, Truck, ArrowRight, MapPin, RefreshCw, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onBrowseShop: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered') => void;
}

export default function OrderHistory({
  orders,
  onBrowseShop,
  onUpdateOrderStatus,
}: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status mapping
  const getStatusDetails = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Aguardando Pagamento',
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          stepIndex: 1,
          desc: 'Seu pagamento está sendo analisado pela operadora ou aguardando compensação do PIX/Boleto.',
        };
      case 'processing':
        return {
          label: 'Preparando Envio',
          color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
          stepIndex: 2,
          desc: 'O pagamento foi confirmado. Nossa equipe do complexo físico de estilo está separando e embalando seus produtos.',
        };
      case 'shipped':
        return {
          label: 'Despachado / Em Trânsito',
          color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
          stepIndex: 3,
          desc: 'Sua encomenda foi postada nos Correios/ALT-Courier e está a caminho do seu endereço.',
        };
      case 'delivered':
        return {
          label: 'Entregue',
          color: 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20',
          stepIndex: 4,
          desc: 'A entrega foi concluída no endereço cadastrado. Aproveite seu novo estilo underground!',
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'text-zinc-500 bg-zinc-500/10 border-zinc-550/20',
          stepIndex: 0,
          desc: 'Status indefinido.',
        };
    }
  };

  const getPaymentMethodLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'pix':
        return 'Pix - 5% Desconto';
      case 'boleto':
        return 'Boleto Bancário';
    }
  };

  const getPaymentIcon = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <QrCode className="h-4 w-4 text-[#39FF14]" />;
      case 'boleto':
        return <FileText className="h-4 w-4" />;
    }
  };

  const getShippingLabel = (method: Order['shippingMethod']) => {
    switch (method) {
      case 'pac':
        return 'Correios PAC (7 a 10 dias úteis)';
      case 'sedex':
        return 'Correios SEDEX (2 a 4 dias úteis)';
      case 'underground':
        return 'ALT-Courier Cyber Fast (Até 24h)';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="font-mono text-lg font-black tracking-widest text-white uppercase">
            MEUS PEDIDOS & RASTREAMENTO
          </h2>
          <p className="font-mono text-4xs text-zinc-500 uppercase tracking-wider mt-1">
            CONSULTE E ACOMPANHE O STATUS DAS SUAS AQUISIÇÕES ALTERNATIVAS
          </p>
        </div>
        <button
          onClick={onBrowseShop}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-mono text-3xs uppercase tracking-widest border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          IR PARA A LOJA
        </button>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-900 rounded-2xl bg-zinc-950/20 backdrop-blur-sm px-6">
          <div className="h-16 w-16 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-550 mb-5 shadow-inner">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase mb-2">NENHUM PEDIDO LOCALIZADO</h3>
          <p className="text-3xs text-zinc-500 font-mono uppercase max-w-sm leading-relaxed mb-6">
            Você ainda não realizou transações no Alt-Closet. Explore o catálogo, monte seu visual ideal e finalize a compra.
          </p>
          <button
            onClick={onBrowseShop}
            className="px-6 py-3 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-3xs font-black tracking-widest uppercase transition-all shadow-neon cursor-pointer"
          >
            ADQUIRIR MANTO SAGRADO
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Orders list */}
          <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1.5 custom-scrollbar">
            {orders.map((order) => {
              const details = getStatusDetails(order.status);
              const isSelected = selectedOrder?.id === order.id;
              
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all flex flex-col gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-neon'
                      : 'border-zinc-900 bg-zinc-950/40 hover:border-zinc-850 hover:bg-zinc-950/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-2xs font-extrabold text-white tracking-wider">
                      {order.id}
                    </span>
                    <span className={`font-mono text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${details.color}`}>
                      {details.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-450 font-mono text-[9px] uppercase">
                    <Calendar className="h-3 w-3" />
                    <span>Realizado em: {order.createdAt}</span>
                  </div>

                  {/* Tiny thumbnails row */}
                  <div className="flex gap-1.5 items-center mt-1 border-t border-zinc-900/60 pt-2.5">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {order.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-md object-cover border border-zinc-950 flex-shrink-0"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-zinc-500 uppercase ml-auto font-semibold">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} {order.items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? 'item' : 'itens'} • R$ {order.total.toFixed(2)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Order Tracking */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md space-y-6 animate-fade-in text-left">
                {/* Header */}
                <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-mono text-xs font-black tracking-widest text-white uppercase">
                      DETALHES DO PEDIDO {selectedOrder.id}
                    </h3>
                    <p className="font-mono text-4xs text-zinc-500 uppercase mt-0.5">
                      REALIZADO EM {selectedOrder.createdAt}
                    </p>
                  </div>
                  
                  {/* Status Simulator Button (Extremely satisfying interactive tool!) */}
                  {onUpdateOrderStatus && selectedOrder.status !== 'delivered' && (
                    <button
                      onClick={() => {
                        const statusFlow: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
                        const curIdx = statusFlow.indexOf(selectedOrder.status);
                        const nextStatus = statusFlow[curIdx + 1];
                        if (nextStatus) {
                          onUpdateOrderStatus(selectedOrder.id, nextStatus);
                          setSelectedOrder({
                            ...selectedOrder,
                            status: nextStatus,
                          });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[9px] uppercase tracking-widest border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                    >
                      <RefreshCw className="h-3 w-3 text-neon animate-spin-slow" />
                      SIMULAR AVANÇAR STATUS
                    </button>
                  )}
                </div>

                {/* Status Timeline Progress Visualizer */}
                <div className="space-y-4">
                  <h4 className="font-mono text-4xs text-zinc-400 uppercase tracking-widest font-bold">
                    RASTREAMENTO DA ENCOMENDA
                  </h4>
                  
                  {/* Timeline steps */}
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
                    {/* Line behind */}
                    <div className="absolute left-3.5 top-0 bottom-0 md:left-0 md:right-0 md:h-[2px] md:top-4 bg-zinc-900 z-0"></div>
                    
                    {/* Active highlighted progress line */}
                    {(() => {
                      const details = getStatusDetails(selectedOrder.status);
                      const widthPct = details.stepIndex === 1 ? '0%' : details.stepIndex === 2 ? '33%' : details.stepIndex === 3 ? '66%' : '100%';
                      return (
                        <div
                          className="absolute left-3.5 top-0 bottom-0 md:left-0 md:h-[2px] md:top-4 bg-[#39FF14] z-0 transition-all duration-700 shadow-neon"
                          style={{
                            height: window.innerWidth < 768 ? (details.stepIndex === 1 ? '0px' : details.stepIndex === 2 ? '40px' : details.stepIndex === 3 ? '100px' : '150px') : '2px',
                            width: window.innerWidth >= 768 ? widthPct : '2px',
                          }}
                        ></div>
                      );
                    })()}

                    {/* Step 1: Pending */}
                    <div className="flex md:flex-col items-center gap-3 md:gap-2 z-10 text-left md:text-center flex-1">
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        selectedOrder.status === 'pending' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                          ? 'border-[#39FF14] bg-black text-[#39FF14] shadow-neon'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-500'
                      }`}>
                        {selectedOrder.status === 'pending' ? <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-mono text-4xs font-black text-white uppercase tracking-wider">Aguardando Pagamento</p>
                        <p className="font-mono text-[7px] text-zinc-500 uppercase">Confirmado</p>
                      </div>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="flex md:flex-col items-center gap-3 md:gap-2 z-10 text-left md:text-center flex-1">
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                          ? 'border-[#39FF14] bg-black text-[#39FF14] shadow-neon'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-500'
                      }`}>
                        {selectedOrder.status === 'processing' ? <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> : selectedOrder.status === 'pending' ? '02' : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-mono text-4xs font-black text-white uppercase tracking-wider">Preparando Envio</p>
                        <p className="font-mono text-[7px] text-zinc-500 uppercase">
                          {selectedOrder.status === 'pending' ? 'Aguardando' : selectedOrder.status === 'processing' ? 'Em Progresso' : 'Concluído'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="flex md:flex-col items-center gap-3 md:gap-2 z-10 text-left md:text-center flex-1">
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                          ? 'border-[#39FF14] bg-black text-[#39FF14] shadow-neon'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-500'
                      }`}>
                        {selectedOrder.status === 'shipped' ? <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> : selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? '03' : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-mono text-4xs font-black text-white uppercase tracking-wider">Despachado / Em Trânsito</p>
                        <p className="font-mono text-[7px] text-zinc-500 uppercase">
                          {selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? 'Aguardando' : selectedOrder.status === 'shipped' ? 'Em Trânsito' : 'Concluído'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex md:flex-col items-center gap-3 md:gap-2 z-10 text-left md:text-center flex-1">
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        selectedOrder.status === 'delivered'
                          ? 'border-[#39FF14] bg-black text-[#39FF14] shadow-neon'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-500'
                      }`}>
                        {selectedOrder.status === 'delivered' ? <CheckCircle2 className="h-4 w-4" /> : '04'}
                      </div>
                      <div>
                        <p className="font-mono text-4xs font-black text-white uppercase tracking-wider">Entregue</p>
                        <p className="font-mono text-[7px] text-zinc-500 uppercase">
                          {selectedOrder.status === 'delivered' ? 'Concluído' : 'Pendente'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Helper Description Banner */}
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950 font-mono text-4xs text-zinc-450 leading-relaxed uppercase">
                    <span className="text-zinc-200 font-bold block mb-1">DETALHES DA LOGÍSTICA ATUAL:</span>
                    {getStatusDetails(selectedOrder.status).desc}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  <h4 className="font-mono text-4xs text-zinc-400 uppercase tracking-widest font-bold border-b border-zinc-900 pb-2">
                    ITEMS DO PEDIDO
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center justify-between border-b border-zinc-900/40 pb-3">
                        <div className="flex gap-3 items-center min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-zinc-900 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-sans text-xs font-bold text-white truncate uppercase">
                              {item.product.name}
                            </h5>
                            <p className="font-mono text-4xs text-zinc-500 uppercase mt-1">
                              TAMANHO: <span className="text-zinc-300 font-semibold">{item.selectedSize}</span> • QUANTIDADE: <span className="text-zinc-300 font-semibold">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-mono text-xs font-extrabold text-[#39FF14]">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          {item.product.originalPrice && (
                            <p className="font-mono text-[9px] text-zinc-650 line-through">
                              R$ {(item.product.originalPrice * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics details / payment summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Shipping info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-4xs font-bold uppercase">
                      <MapPin className="h-3.5 w-3.5 text-[#39FF14]" />
                      LOGÍSTICA DE ENTREGA
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-2 font-mono text-4xs text-zinc-500 uppercase">
                      <p>
                        <span className="text-zinc-400 font-semibold block mb-0.5">MÉTODO DE FRETE:</span>
                        {getShippingLabel(selectedOrder.shippingMethod)}
                      </p>
                      <p>
                        <span className="text-zinc-400 font-semibold block mb-0.5">ENDEREÇO DE ENTREGA:</span>
                        {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}
                        <br />
                        {selectedOrder.deliveryAddress.neighborhood} - {selectedOrder.deliveryAddress.city}/{selectedOrder.deliveryAddress.state}
                        <br />
                        CEP: {selectedOrder.deliveryAddress.cep}
                      </p>
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-4xs font-bold uppercase">
                      {getPaymentIcon(selectedOrder.paymentMethod)}
                      MÉTODO DE PAGAMENTO & TOTAL
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-3 font-mono text-4xs text-zinc-500 uppercase">
                      <div>
                        <span className="text-zinc-400 font-semibold block">MÉTODO DE PAGAMENTO:</span>
                        <span className="text-white font-bold">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span>
                      </div>

                      <div className="border-t border-zinc-900 pt-3">
                        <span className="text-zinc-400 font-semibold block">TOTAL DA COMPRA:</span>
                        <span className="font-sans text-base font-black text-[#39FF14] tracking-wider block mt-1">
                          R$ {selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Detail Empty State */
              <div className="h-full flex flex-col items-center justify-center py-20 text-center border border-zinc-900 border-dashed rounded-2xl bg-zinc-950/10 px-6">
                <Truck className="h-10 w-10 text-zinc-700 animate-pulse mb-3" />
                <p className="font-mono text-4xs text-zinc-550 uppercase tracking-widest leading-relaxed">
                  SELECIONE UM PEDIDO AO LADO PARA
                  <br />
                  ACOMPANHAR O RASTREAMENTO COMPLETO
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
