/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'jersey-brasil',
    name: 'Camisa Concept Brasil Dark Lightning',
    price: 349.90,
    originalPrice: 399.90,
    image: '/src/assets/images/national_jersey_1782594898265.jpg',
    category: 'top',
    aesthetic: 'cyberpunk',
    league: 'selecoes',
    description: 'Uma releitura cibernética e misteriosa da Seleção. Tecido premium dry-fit em preto profundo, cortado por raios verdes neon (#39FF14) e escudo minimalista termo-aplicado.',
    rating: 4.9,
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    features: ['Tecido ultra-respirável Dry-Fit', 'Raios impressos com tinta neon reativa', 'Escudo minimalista emborrachado', 'Modelagem atlética slim']
  },
  {
    id: 'jersey-brasileirao',
    name: 'Camisa Concept Alviverde Cyber',
    price: 299.90,
    originalPrice: 389.90,
    image: '/src/assets/images/brasileirao_jersey_1782594863738.jpg',
    category: 'top',
    aesthetic: 'techwear',
    league: 'brasileirao',
    description: 'Inspirada no futebol brasileiro, unindo a paixão sagrada das arquibancadas à cultura cyberpunk. Silhueta imponente com grafismo digital verde neon tridimensional.',
    rating: 4.8,
    sizes: ['P', 'M', 'G', 'GG'],
    features: ['Grafismo sublimado de alta resolução', 'Linhas de costura reforçadas e reflexivas', 'Poliéster reciclado de alto desempenho', 'Punhos canelados de toque macio']
  },
  {
    id: 'jersey-premier',
    name: 'Camisa Concept Manchester Pitch-Black',
    price: 359.90,
    originalPrice: 419.90,
    image: '/src/assets/images/premier_jersey_1782594875609.jpg',
    category: 'top',
    aesthetic: 'gothic',
    league: 'premier_league',
    description: 'Preto absoluto cortado por listras verticais neon brilhantes de alta visibilidade. Uma representação sublime do ritmo frenético e imponente do futebol inglês.',
    rating: 4.9,
    sizes: ['P', 'M', 'G', 'GG', 'EGG'],
    features: ['Fios pretos texturizados mate', 'Listras pinstripe em verde neon brilhante', 'Gola polo estilizada com botões ocultos', 'Tecnologia de gerenciamento de umidade']
  },
  {
    id: 'jersey-bundesliga',
    name: 'Camisa Concept Bayern Carbon-Tech',
    price: 319.90,
    originalPrice: 399.90,
    image: '/src/assets/images/bundesliga_jersey_1782594886421.jpg',
    category: 'top',
    aesthetic: 'techwear',
    league: 'bundesliga',
    description: 'Textura futurista de fibra de carbono combinada com listras de alta precisão em verde neon fluorescente. Engenharia e moda esportiva fundidas para o kit definitivo.',
    rating: 4.7,
    sizes: ['P', 'M', 'G', 'GG'],
    features: ['Efeito fibra de carbono tridimensional', 'Frisos laterais elásticos para máxima mobilidade', 'Detalhes de ventilação cortados a laser', 'Patches premium vulcanizados']
  },
  {
    id: 'jersey-ligue1',
    name: 'Camisa Concept Paris Avant-Garde',
    price: 339.90,
    image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=600',
    category: 'top',
    aesthetic: 'gothic',
    league: 'ligue_1',
    description: 'Projetada para dominar os holofotes. Combina uma silhueta de alta costura parisiense com detalhes góticos sutis e costura fluorescente ativa sob luz negra.',
    rating: 4.6,
    sizes: ['P', 'M', 'G', 'GG'],
    features: ['Sublimação com pigmento reativo a UV', 'Decote diferenciado com costuras reforçadas', 'Tecido com proteção solar UV50+', 'Fita de gola personalizada']
  },
  {
    id: 'jersey-selecao-cyber',
    name: 'Camisa Concept Albiceleste Neon',
    price: 349.90,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    category: 'top',
    aesthetic: 'cyberpunk',
    league: 'selecoes',
    description: 'O clássico futebol platino reconfigurado. Listras desconstruídas em azul degradê digital profundo e contornos verdes neons fluorescentes.',
    rating: 4.8,
    sizes: ['P', 'M', 'G', 'GG'],
    features: ['Efeito glitch art sublimado', 'Logos em silicone de alta densidade', 'Painéis laterais de malha mesh respirável', 'Toque ultra macio e gelado']
  },
  {
    id: 'jersey-paulista',
    name: 'Camisa Concept Paulista Rebel',
    price: 329.90,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
    category: 'top',
    aesthetic: 'grunge',
    league: 'brasileirao',
    description: 'Estética grunge desconstruída com listras tricolores alternativas fundidas com a aura ácida do verde neon de alta densidade e detalhes desfiados artificiais na gola.',
    rating: 4.7,
    sizes: ['P', 'M', 'G', 'GG'],
    features: ['Textura grunge com efeito lavado', 'Gola e punhos com detalhes rústicos', 'Escudo clássico reestilizado em verde neon', 'Algodão e poliéster reciclado sustentável']
  },
  {
    id: 'cyber-cargo',
    name: 'Calça Cargo Shinobi Tactical',
    price: 429.00,
    image: '/src/assets/images/cyber_cargo_1782593248070.jpg',
    category: 'bottom',
    aesthetic: 'techwear',
    description: 'Calça cargo tática de peso pesado com tiras de nylon ajustáveis verdes neon, fivelas magnéticas de alta liberação e punhos canelados para ajuste perfeito.',
    rating: 4.8,
    sizes: ['38', '40', '42', '44', '46'],
    features: ['Tecido ripstop resistente à água', 'Fivelas e tiras utilitárias verdes neon', 'Seis bolsos cargo estratégicos', 'Ajuste de tornozelo por cordão elástico']
  },
  {
    id: 'grunge-skirt',
    name: 'Saia Anarchy Plissada Neon-Chain',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    category: 'bottom',
    aesthetic: 'grunge',
    description: 'Saia punk assimétrica em sarja desfiada preta com correntes de metal brilhantes e detalhes internos em verde neon reativo.',
    rating: 4.7,
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    features: ['Remates desfiados manuais estilo grunge', 'Correntes duplas de liga antiferrugem', 'Shorts interno integrado verde neon', 'Cós alto estruturado com passantes']
  },
  {
    id: 'goth-boots',
    name: 'Coturno Dominator Neon-Tread',
    price: 599.90,
    image: '/src/assets/images/platform_boots_1782593211250.jpg',
    category: 'footwear',
    aesthetic: 'gothic',
    description: 'Bota cano alto em couro fosco impermeável de alta resistência. Solado tratorado maciço de 8cm com preenchimento em borracha translúcida verde neon reativa.',
    rating: 4.9,
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
    features: ['Solado de plataforma tratorada de 8cm', 'Costura dupla reforçada em linha verde neon', 'Zíper lateral robusto para calce rápido', 'Palmilha de absorção de impacto em gel']
  },
  {
    id: 'creeper-shoes',
    name: 'Sapatilha Creeper Abyss Suede',
    price: 389.90,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
    category: 'footwear',
    aesthetic: 'grunge',
    description: 'Clássico calçado underground de camurça escovada premium. Costuras e trançados manuais em verde neon com sola tratorada vulcanizada de 5.5cm.',
    rating: 4.6,
    sizes: ['36', '37', '38', '39', '40', '41'],
    features: ['Plataforma vulcanizada de 5.5cm', 'Couro camurça bovina selecionada', 'Trançado manual no bico em verde neon', 'Ilhóses de liga cromada escurecida']
  },
  {
    id: 'tech-harness-vest',
    name: 'Colete Harness Modular Aegis',
    price: 269.90,
    originalPrice: 349.90,
    image: '/src/assets/images/tech_harness_vest_1782593258000.jpg', // let's fallback elegantly or use unsplash if missing
    category: 'accessory',
    aesthetic: 'techwear',
    description: 'Colete peitoral modular que oferece máxima funcionalidade urbana. Equipado com fechos rápidos magnéticos e detalhes em viés reflexivo verde neon.',
    rating: 4.8,
    sizes: ['TAMANHO ÚNICO'],
    features: ['Fivelas magnéticas estilo Fidlock', 'Duplo bolso frontal expansível com zíper', 'Costas em mesh tecnológico respirável', 'Tiras ajustáveis de alta densidade']
  },
  {
    id: 'cyber-visor',
    name: 'Viseira HUD Horizon Neon',
    price: 159.90,
    originalPrice: 229.90,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    category: 'accessory',
    aesthetic: 'cyberpunk',
    description: 'Óculos esportivos tipo escudo futurista com lentes polarizadas translúcidas em gradiente verde neon ácido e proteção UV400 absoluta.',
    rating: 4.6,
    sizes: ['TAMANHO ÚNICO'],
    features: ['Lente panorâmica polarizada anti-risco', 'Proteção total UV400 contra raios nocivos', 'Hastes em liga de policarbonato flexível', 'Estojo protetor rígido incluído']
  }
];
