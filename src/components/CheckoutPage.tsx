/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, FileText, Truck, ShieldCheck, ArrowLeft, CheckCircle2, Copy, AlertCircle, ShoppingBag } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onSuccess: () => void;
  clearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onViewOrders?: () => void;
}

export default function CheckoutPage({
  cartItems,
  onBack,
  onSuccess,
  clearCart,
  onPlaceOrder,
  onViewOrders,
}: CheckoutPageProps) {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  
  const [isCpfValid, setIsCpfValid] = useState(true);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState(false);

  // Shipping & Payment selection states
  const [shippingMethod, setShippingMethod] = useState<'pac' | 'sedex' | 'underground'>('pac');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // UX states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'form' | 'success'>('form');
  const [pixCopied, setPixCopied] = useState(false);
  const [boletoCopied, setBoletoCopied] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState('');
  const [generatedPixKey] = useState(`00020101021226830014br.gov.pix0136altcloset-pix-key-${Math.random().toString(36).substring(2, 10)}5204000053039865405100.005802BR5910AltCloset6009SaoPaulo62070503***6304FC3F`);
  const [generatedBoletoBarcode] = useState(`${Math.floor(Math.random() * 9)}3991.${Math.floor(Math.random() * 9)}7402 ${Math.floor(Math.random() * 9)}1000.7${Math.floor(Math.random() * 9)}3123 ${Math.floor(Math.random() * 9)}5678.901234 9 934500000${Math.floor(Math.random() * 9)}00`);

  // Auto-fill address mock when CEP is 8 digits long
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsCepLoading(true);
      setCepError(false);
      
      // Simulate real CEP query API
      const timer = setTimeout(() => {
        setIsCepLoading(false);
        // Realistic fallback mock based on digit patterns
        if (cleanCep.startsWith('0') || cleanCep.startsWith('1')) {
          setAddress({
            street: 'Avenida Paulista',
            number: '',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
          });
        } else if (cleanCep.startsWith('2')) {
          setAddress({
            street: 'Avenida Atlântica',
            number: '',
            neighborhood: 'Copacabana',
            city: 'Rio de Janeiro',
            state: 'RJ',
          });
        } else if (cleanCep.startsWith('4')) {
          setAddress({
            street: 'Avenida Sete de Setembro',
            number: '',
            neighborhood: 'Barra',
            city: 'Salvador',
            state: 'BA',
          });
        } else if (cleanCep.startsWith('3')) {
          setAddress({
            street: 'Avenida Afonso Pena',
            number: '',
            neighborhood: 'Centro',
            city: 'Belo Horizonte',
            state: 'MG',
          });
        } else {
          setAddress({
            street: 'Rua das Camisas de Time Alternativas',
            number: '',
            neighborhood: 'Vila Underground',
            city: 'Curitiba',
            state: 'PR',
          });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [cep]);

  // Input format helpers
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Apply CPF masking: 123.456.789-01
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setCpf(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCep(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Add spaces every 4 digits
    const parts = value.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const copyToClipboard = (text: string, type: 'pix' | 'boleto') => {
    navigator.clipboard.writeText(text);
    if (type === 'pix') {
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    } else {
      setBoletoCopied(true);
      setTimeout(() => setBoletoCopied(false), 2000);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Freight calculation rules
  const getShippingCost = () => {
    const isFree = subtotal > 400;
    if (shippingMethod === 'pac') return isFree ? 0 : 15.00;
    if (shippingMethod === 'sedex') return isFree ? 15.00 : 35.00; // discounted for loyal buyers
    return 45.00; // alt-courier always pays full speed
  };

  const getShippingDays = () => {
    if (shippingMethod === 'pac') return '7 a 10 dias úteis';
    if (shippingMethod === 'sedex') return '2 a 4 dias úteis';
    return 'Entregue em até 24 horas';
  };

  const shippingCost = getShippingCost();
  // 5% extra discount for PIX
  const paymentDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = subtotal - paymentDiscount + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !cep || !address.street || !address.number) {
      alert('Por favor, preencha todos os campos obrigatórios de entrega.');
      return;
    }
    
    if (paymentMethod === 'credit_card' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      alert('Por favor, preencha todos os dados do cartão de crédito.');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `#${Math.floor(Math.random() * 900000 + 100000)}`;
    setLastPlacedOrderId(generatedId);

    // Create complete order object
    const newOrder: Order = {
      id: generatedId,
      items: [...cartItems],
      total: total,
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      shippingMethod: shippingMethod,
      deliveryAddress: {
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        cep: cep,
      },
    };

    // Simulate payment capture and inventory routing
    setTimeout(() => {
      setIsSubmitting(false);
      setPurchaseStep('success');
      onPlaceOrder(newOrder);
      clearCart();
      onSuccess();
    }, 2500);
  };

  if (cartItems.length === 0 && purchaseStep === 'form') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase mb-2">Seu Carrinho está Vazio</h3>
        <p className="text-3xs text-zinc-500 font-mono uppercase mb-6">Selecione peças de destaque no catálogo antes de fechar pedido.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#39FF14] text-white font-mono text-xs uppercase tracking-widest cursor-pointer transition-all"
        >
          Voltar para Loja
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      {purchaseStep === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-8 space-y-6">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-4xs uppercase tracking-widest transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              VOLTAR AO COMPLEXO DE SELEÇÃO
            </button>

            {/* Title */}
            <div>
              <h2 className="font-mono text-lg font-black tracking-widest text-white uppercase">
                FINALIZAR AQUISIÇÃO SEGURA
              </h2>
              <p className="font-mono text-4xs text-zinc-500 uppercase tracking-wider mt-1">
                SISTEMA INTEGRADO ALT-COMPRAS COM CRIPTOGRAFIA DE 256 BITS
              </p>
            </div>

            {/* Section 1: Personal Data & Delivery */}
            <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <div className="h-5 w-5 rounded bg-neon/10 flex items-center justify-center border border-neon/30">
                  <span className="font-mono text-4xs font-bold text-neon">01</span>
                </div>
                <h3 className="font-mono text-2xs font-bold tracking-widest text-white uppercase">
                  DADOS PESSOAIS & LOGÍSTICA DE ENTREGA
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">NOME COMPLETO *</label>
                  <input
                    type="text"
                    required
                    placeholder="DIGITE SEU NOME INTEGRAL..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">E-MAIL PARA RASTREIO *</label>
                  <input
                    type="email"
                    required
                    placeholder="EX: USUARIO@PROVEDOR.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">TELEFONE DE CONTATO *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">CPF PARA NOTA FISCAL *</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                    <span>CEP *</span>
                    {isCepLoading && <span className="text-neon animate-pulse">BUSCANDO...</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="00000-000"
                    value={cep}
                    onChange={handleCepChange}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                  />
                </div>
              </div>

              {/* Address detail card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                <div className="md:col-span-8 space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">LOGRADOURO/AVENIDA *</label>
                  <input
                    type="text"
                    required
                    placeholder="RUA, AVENIDA, TRAVESSA..."
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
                <div className="md:col-span-4 space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">NÚMERO *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: 154 AP 4"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">BAIRRO *</label>
                  <input
                    type="text"
                    required
                    placeholder="BAIRRO..."
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">CIDADE *</label>
                  <input
                    type="text"
                    required
                    placeholder="CIDADE..."
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">ESTADO *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: SP"
                    maxLength={2}
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/60 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Freight Info / Shipping */}
            <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Truck className="h-4 w-4 text-neon" />
                <h3 className="font-mono text-2xs font-bold tracking-widest text-white uppercase">
                  ESCOLHA DO SERVIÇO DE ENVIO & DETALHES DE FRETE
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Option 1: PAC */}
                <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                  shippingMethod === 'pac'
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-neon'
                    : 'border-zinc-900 bg-zinc-900/10 hover:border-zinc-800'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="pac"
                    checked={shippingMethod === 'pac'}
                    onChange={() => setShippingMethod('pac')}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-mono text-4xs font-black text-zinc-400 uppercase tracking-widest block">CORREIOS PAC</span>
                    <span className="font-sans text-xs font-bold text-white mt-1 block">Econômico Regular</span>
                    <span className="font-mono text-5xs text-zinc-500 mt-2 block uppercase">Previsão: 7 a 10 dias úteis</span>
                  </div>
                  <span className="font-mono text-3xs text-neon font-black mt-4">
                    {subtotal > 400 ? 'GRÁTIS' : 'R$ 15,00'}
                  </span>
                </label>

                {/* Option 2: SEDEX */}
                <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                  shippingMethod === 'sedex'
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-neon'
                    : 'border-zinc-900 bg-zinc-900/10 hover:border-zinc-800'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="sedex"
                    checked={shippingMethod === 'sedex'}
                    onChange={() => setShippingMethod('sedex')}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-mono text-4xs font-black text-[#39FF14] uppercase tracking-widest block">CORREIOS SEDEX</span>
                    <span className="font-sans text-xs font-bold text-white mt-1 block">Expresso Prioritário</span>
                    <span className="font-mono text-5xs text-zinc-500 mt-2 block uppercase">Previsão: 2 a 4 dias úteis</span>
                  </div>
                  <span className="font-mono text-3xs text-neon font-black mt-4">
                    {subtotal > 400 ? 'R$ 15,00' : 'R$ 35,00'}
                  </span>
                </label>

                {/* Option 3: ALT-Courier */}
                <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                  shippingMethod === 'underground'
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-neon'
                    : 'border-zinc-900 bg-zinc-900/10 hover:border-zinc-800'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="underground"
                    checked={shippingMethod === 'underground'}
                    onChange={() => setShippingMethod('underground')}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-mono text-4xs font-black text-purple-400 uppercase tracking-widest block">ALT-COURIER</span>
                    <span className="font-sans text-xs font-bold text-white mt-1 block">Blindagem Cyber Fast</span>
                    <span className="font-mono text-5xs text-zinc-500 mt-2 block uppercase">Previsão: até 24 horas</span>
                  </div>
                  <span className="font-mono text-3xs text-neon font-black mt-4">
                    R$ 45,00
                  </span>
                </label>
              </div>

              {/* Shipping info text box */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4.5 flex gap-3.5 items-start">
                <AlertCircle className="h-4.5 w-4.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 font-mono text-4xs text-zinc-500 uppercase leading-relaxed">
                  <p className="text-zinc-300 font-bold tracking-wider">REGRAS DE EMBALAGEM E LOGÍSTICA UNDERGROUND:</p>
                  <p>• Suas camisas de time alternativas e acessórios são preparados em uma caixa reforçada e lacrada a vácuo com proteção antiestática.</p>
                  <p>• Frete Grátis na modalidade PAC concedido automaticamente para qualquer carrinho acima de R$ 400,00.</p>
                  <p>• O código de rastreamento de segurança será enviado para o e-mail cadastrado no momento do despacho em até 6 horas.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method Selection */}
            <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-neon" />
                  <h3 className="font-mono text-2xs font-bold tracking-widest text-white uppercase">
                    MÉTODO DE PAGAMENTO SEGURO
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-5xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 tracking-widest uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  AMBIENTE PROTEGIDO
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`py-3.5 rounded-xl border font-mono text-3xs tracking-widest uppercase flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14] shadow-neon font-bold'
                      : 'border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:border-zinc-850 hover:text-zinc-300'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  CARTÃO
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-3.5 rounded-xl border font-mono text-3xs tracking-widest uppercase flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative ${
                    paymentMethod === 'pix'
                      ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14] shadow-neon font-bold'
                      : 'border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:border-zinc-850 hover:text-zinc-300'
                  }`}
                >
                  <span className="absolute -top-2 right-2 bg-[#39FF14] text-black font-mono font-extrabold text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    -5% EXTRA
                  </span>
                  <QrCode className="h-4 w-4" />
                  PIX NEON
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`py-3.5 rounded-xl border font-mono text-3xs tracking-widest uppercase flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'boleto'
                      ? 'border-[#39FF14] bg-[#39FF14]/5 text-[#39FF14] shadow-neon font-bold'
                      : 'border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:border-zinc-850 hover:text-zinc-300'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  BOLETO
                </button>
              </div>

              {/* Credit Card inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-2 animate-fade-in">
                  <div className="space-y-1">
                    <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">NÚMERO DO CARTÃO *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        required={paymentMethod === 'credit_card'}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/40 pl-11 pr-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">NOME IMPRESSO NO CARTÃO *</label>
                    <input
                      type="text"
                      required={paymentMethod === 'credit_card'}
                      placeholder="NOME IGUAL AO IMPRESSO NO CARTÃO..."
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-900/40 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase placeholder:text-zinc-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">VALIDADE (MM/AA) *</label>
                      <input
                        type="text"
                        required={paymentMethod === 'credit_card'}
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/40 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">CÓDIGO DE SEGURANÇA (CVV) *</label>
                      <input
                        type="text"
                        required={paymentMethod === 'credit_card'}
                        placeholder="000"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/40 px-3.5 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-zinc-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-4xs text-zinc-400 uppercase tracking-widest">PARCELAMENTO *</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full rounded-xl border border-zinc-850 bg-zinc-900/40 px-3 py-2.5 font-mono text-2xs text-white focus:outline-none focus:border-[#39FF14] transition-colors uppercase cursor-pointer"
                    >
                      <option value="1">1x de R$ {total.toFixed(2)} sem juros</option>
                      <option value="2">2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                      <option value="3">3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                      <option value="4">4x de R$ {(total * 1.05 / 4).toFixed(2)} com juros (5%)</option>
                      <option value="6">6x de R$ {(total * 1.08 / 6).toFixed(2)} com juros (8%)</option>
                      <option value="10">10x de R$ {(total * 1.12 / 10).toFixed(2)} com juros (12%)</option>
                      <option value="12">12x de R$ {(total * 1.15 / 12).toFixed(2)} com juros (15%)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PIX UI */}
              {paymentMethod === 'pix' && (
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col md:flex-row items-center gap-5.5 animate-fade-in">
                  {/* Dynamic Visual QR Box */}
                  <div className="w-32 h-32 bg-zinc-900 rounded-xl p-2 flex flex-col items-center justify-center border border-zinc-800 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#39FF14]/5 to-transparent"></div>
                    {/* Scanning animation line */}
                    <div className="absolute left-0 right-0 h-[2px] bg-[#39FF14] top-0 animate-scanner shadow-neon"></div>
                    <div className="w-24 h-24 border border-zinc-700 p-1 bg-white rounded flex items-center justify-center">
                      {/* Interactive mock high-contrast QR code vector */}
                      <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h6v6H2V2zm2 2v2h2V4H4zm10-2h6v6h-6V2zm2 2v2h2V4h-2zM2 14h6v6H2v-6zm2 2v2h2v-2H4zm14 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-6-4h2v2h-2v-2zm2-2h2v2h-2V8zm-2-2h2v2h-2V6zm8 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm2-2h2v2h-2v-2zm-2 4h2v2h-2v-2zm2-2h2v2h-2v-2zm4 2h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <span className="font-mono text-[7px] text-zinc-500 uppercase tracking-widest mt-1.5 font-bold">ALT-PIX QR CODE</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="font-mono text-4xs text-zinc-400 uppercase tracking-widest leading-relaxed">
                      <p className="text-zinc-300 font-bold tracking-wider">PAGUE COM PIX E CONFIRME SEU DESCONTO:</p>
                      <p className="text-[#39FF14] font-semibold">• Você ganhou 5% de desconto exclusivo por pagar via PIX.</p>
                      <p>• Escaneie o QR Code ao lado ou use a chave PIX Copia e Cola para pagar no app do seu banco.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedPixKey}
                        className="flex-1 rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-2 font-mono text-[9px] text-zinc-400 focus:outline-none select-all truncate"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedPixKey, 'pix')}
                        className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-4xs uppercase tracking-widest border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {pixCopied ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-[#39FF14]" />
                            COPIADO
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            COPIAR CHAVE
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Boleto UI */}
              {paymentMethod === 'boleto' && (
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 space-y-3 animate-fade-in">
                  <div className="font-mono text-4xs text-zinc-400 uppercase tracking-widest leading-relaxed">
                    <p className="text-zinc-300 font-bold tracking-wider">BOLETO BANCÁRIO DETALHES:</p>
                    <p>• O boleto vence em 2 dias corridos. Após o vencimento, o pedido será desativado automaticamente.</p>
                    <p>• Pague em qualquer banco, casa lotérica ou aplicativo de transações financeiras.</p>
                    <p>• Copie a linha digitável abaixo ou clique para gerar o PDF completo.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedBoletoBarcode}
                      className="flex-1 rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-2.5 font-mono text-3xs text-zinc-400 focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedBoletoBarcode, 'boleto')}
                      className="px-3.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-4xs uppercase tracking-widest border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {boletoCopied ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#39FF14]" />
                          COPIADO
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          COPIAR LINHA
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit checkout buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3.5 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white font-mono text-3xs font-bold tracking-widest uppercase transition-all cursor-pointer"
              >
                VOLTAR AO GUARDA-ROUPA
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-3xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-neon hover:shadow-[#39FF14]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                    </span>
                    TRANSMITINDO CRIPTOGRAFIA...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    AUTORIZAR COMPRA DE LOOK (R$ {total.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Summary Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 backdrop-blur-md space-y-4">
              <h3 className="font-mono text-2xs font-bold tracking-widest text-white uppercase border-b border-zinc-900 pb-2.5">
                RESUMO DA COMPRA
              </h3>

              {/* Items in purchase */}
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1.5">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="flex gap-3 text-left">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-lg object-cover border border-zinc-900 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 font-mono text-4xs">
                      <h4 className="font-sans text-3xs font-bold text-white truncate uppercase">{item.product.name}</h4>
                      <div className="flex justify-between text-zinc-500 mt-1 uppercase">
                        <span>TAM: {item.selectedSize}</span>
                        <span>QTD: {item.quantity}</span>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        {item.product.originalPrice && (
                          <span className="text-zinc-650 line-through">R$ {(item.product.originalPrice * item.quantity).toFixed(2)}</span>
                        )}
                        <span className="text-neon font-bold ml-auto">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo details info */}
              <div className="border-t border-zinc-900 pt-3 space-y-1.5 font-mono text-4xs text-zinc-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-zinc-200">R$ {subtotal.toFixed(2)}</span>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-[#39FF14]">
                    <span>DESCONTO DE PIX (5%)</span>
                    <span>-R$ {paymentDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>FRETE LOGÍSTICO ({shippingMethod.toUpperCase()})</span>
                  <span className="text-zinc-200">
                    {shippingCost === 0 ? 'GRATUITO' : `R$ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-zinc-900 pt-3.5 flex justify-between text-xs text-white font-black tracking-widest">
                  <span>TOTAL COMPRA</span>
                  <span className="text-neon">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick logistics facts */}
            <div className="p-4 rounded-xl border border-zinc-950 bg-zinc-950/20 space-y-3 font-mono text-[9px] text-zinc-500 uppercase leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-400">
                <Truck className="h-3.5 w-3.5 text-[#39FF14]" />
                <span className="font-bold tracking-wider">ACOMPANHE O ENVIO</span>
              </div>
              <p>• Prazo de entrega estimado: <span className="text-white font-bold">{getShippingDays()}</span>.</p>
              <p>• Nota fiscal eletrônica emitida no CPF cadastrado.</p>
              <p>• Suporte ativo 24/7 de estilo e logística.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Purchase Success Overlay Screen */
        <div className="max-w-md mx-auto text-center py-12 space-y-6 animate-scale-up">
          <div className="h-16 w-16 rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] shadow-neon mx-auto">
            <CheckCircle2 className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-lg font-black tracking-widest text-[#39FF14] uppercase text-neon">
              PAGAMENTO AUTORIZADO!
            </h2>
            <p className="font-mono text-3xs text-zinc-400 uppercase tracking-widest">
              NÚMERO DO PEDIDO: {lastPlacedOrderId}
            </p>
          </div>

          <p className="font-sans text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
            Seu manto sagrado alternativo e acessórios de subcultura já foram separados pela equipe de estilo no armário físico. Sua nota fiscal eletrônica e link de rastreamento com seguro foram transmitidos com sucesso!
          </p>

          <div className="p-4.5 rounded-xl border border-zinc-900 bg-zinc-900/30 space-y-2 font-mono text-[10px] text-zinc-400 uppercase tracking-wide">
            <div className="flex justify-between">
              <span>MÉTODO DE PAGAMENTO:</span>
              <span className="text-white font-bold">{paymentMethod === 'credit_card' ? 'CARTÃO DE CRÉDITO' : paymentMethod === 'pix' ? 'PIX' : 'BOLETO BANCÁRIO'}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS DA ENTREGA:</span>
              <span className="text-neon font-bold">PREPARANDO ENVIO</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#39FF14] text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              VOLTAR AO CATÁLOGO
            </button>
            {onViewOrders && (
              <button
                onClick={onViewOrders}
                className="px-6 py-3 rounded-xl bg-[#39FF14] hover:bg-[#32e010] text-black font-mono text-xs font-black tracking-widest uppercase transition-all shadow-neon cursor-pointer"
              >
                ACOMPANHAR RASTREAMENTO
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
