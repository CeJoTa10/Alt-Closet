/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'top' | 'bottom' | 'footwear' | 'accessory';
  aesthetic: 'gothic' | 'grunge' | 'cyberpunk' | 'techwear';
  league?: 'brasileirao' | 'premier_league' | 'ligue_1' | 'bundesliga' | 'selecoes';
  description: string;
  rating: number;
  sizes: string[];
  features: string[];
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    top?: Product;
    bottom?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  tags: string[];
  savedAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
  recommendedProducts?: string[]; // IDs of products recommended by Gemini
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingMethod: 'pac' | 'sedex' | 'underground';
  deliveryAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
}
