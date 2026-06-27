/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Stylist Endpoint (ALT-BOT)
app.post('/api/stylist', async (req, res) => {
  try {
    const { messages, activeOutfit } = req.body;

    // Build outfit description for Gemini context in Portuguese
    let outfitDesc = 'Nenhum item montado';
    if (activeOutfit) {
      const parts = [];
      if (activeOutfit.top) parts.push(`Camisa: ${activeOutfit.top.name} (Preço: R$${activeOutfit.top.price}, Estilo: ${activeOutfit.top.aesthetic}, Liga: ${activeOutfit.top.league || 'Sem liga'})`);
      if (activeOutfit.bottom) parts.push(`Calça/Saia: ${activeOutfit.bottom.name} (Preço: R$${activeOutfit.bottom.price}, Estilo: ${activeOutfit.bottom.aesthetic})`);
      if (activeOutfit.footwear) parts.push(`Calçado: ${activeOutfit.footwear.name} (Preço: R$${activeOutfit.footwear.price}, Estilo: ${activeOutfit.footwear.aesthetic})`);
      if (activeOutfit.accessory) parts.push(`Acessório: ${activeOutfit.accessory.name} (Preço: R$${activeOutfit.accessory.price}, Estilo: ${activeOutfit.accessory.aesthetic})`);
      if (parts.length > 0) {
        outfitDesc = parts.join(', ');
      }
    }

    const systemInstruction = `Você é o ALT-BOT, um estilista pessoal de moda alternativo especializado em fundir camisas de times de futebol (Brasileirão, Premier League, Ligue 1, Bundesliga, Seleções) com as estéticas Gótica, Grunge, Techwear e Cyberpunk para o e-commerce "ALT-CLOSET".
Sua personalidade é descolada, enigmática, ligeiramente sombria, estilosa e focada no underground urbano e subculturas de moda. Refira-se ao guarda-roupa ou conjunto de roupas do usuário como "armário", "manto" ou "conjunto sagrado".
Sempre responda em Português do Brasil de forma concisa, envolvente, estilosa e com forte apelo visual de subcultura. Use formatação Markdown (como negritos) para destacar peças de vestuário.

Aqui está o catálogo atualizado do ALT-CLOSET:
- 'vasco-goth': Camisa Vasco - Gótico Urbano (R$ 189.90) - Camisa preta com cruz vermelha e detalhes em neon verde #39FF14. (Liga: brasileirao)
- 'corinthians-grunge': Camisa Corinthians - Grunge Underground (R$ 199.90) - Camisa listrada clássica estonada cinza-chumbo. (Liga: brasileirao)
- 'chelsea-techwear': Camisa Chelsea - Cyber Techwear (R$ 219.90) - Camisa azul tática com bolsos removíveis e detalhes refletores. (Liga: premier_league)
- 'milan-cyberpunk': Camisa Milan - Cyberpunk Neon (R$ 229.90) - Vermelho e preto fundidos em feixes neon verde digital. (Liga: selecoes/especial)
- 'real-goth': Camisa Real Madrid - Dark Gothic (R$ 249.90) - Preta com golas barrocas e dragões de alta costura gótica. (Liga: selecoes/especial)
- 'psg-streetwear': Camisa PSG - Streetwear (R$ 239.90) - Camisa do PSG com grafites e detalhes neon verde. (Liga: ligue_1)
- 'brasil-neon': Camisa Seleção Brasileira - Neon Glow (R$ 179.90) - Clássica amarela com feixes de LED neon verde eletrônico. (Liga: selecoes)
- 'cyber-cargo': Calça Cargo Shinobi (R$ 245.00) - Calça preta tática cargo com cintas ajustáveis e bolsos techwear.
- 'goth-boots': Coturnos Dominator (R$ 389.00) - Coturnos pretos plataforma de cano alto com fivelas.
- 'cyber-visor': Óculos Neon Horizon (R$ 115.00) - Óculos viseira futurista cyberpunk com lente espelhada verde neon.
- 'heavy-ring-choker': Choker Argola Pesada (R$ 49.00) - Choker de couro com anel de aço gótico.

O usuário está montando um look no "Painel de Look Ativo".
Os itens atualmente equipados são: ${outfitDesc}.

Analise a mensagem do usuário e suas peças montadas no look. Ofereça conselhos de estilo que mostrem profundo conhecimento sobre camisas de time e as estéticas underground. Se adequado, recomende de 1 a 2 produtos do catálogo acima indicando seus IDs exatos.
Você deve retornar um objeto JSON contendo:
1. 'reply': Sua resposta em markdown, em português brasileiro de forma estilosa.
2. 'recommendedProductIds': Uma lista de strings com IDs de produtos recomendados para complementar o look (exemplo: ["goth-boots", "cyber-visor"]). Deixe vazio se nenhuma recomendação for necessária.`;

    // Try utilizing Gemini
    try {
      const ai = getGeminiClient();

      // Convert conversation history into content parts
      const formattedContents = messages.map((m: any) => {
        return `${m.sender === 'user' ? 'Usuário' : 'ALT-BOT'}: ${m.text}`;
      }).join('\n');

      const userPrompt = `Histórico da conversa:\n${formattedContents}\n\nMensagem atual do usuário:\n${messages[messages.length - 1]?.text || 'Olá'}\n\nRecomende melhorias ou avalie o look atual: ${outfitDesc}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'A resposta do estilista ALT-BOT em markdown português.',
              },
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Os IDs de produtos recomendados para completar o look do usuário.',
              },
            },
            required: ['reply'],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        return res.json({
          reply: parsed.reply,
          recommendedProductIds: parsed.recommendedProductIds || [],
        });
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (apiError: any) {
      console.warn('Gemini API call failed or is unconfigured. Falling back to styled local response rules.', apiError.message);
      
      // Smart offline rules based on keywords (In Portuguese)
      const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "O sinal do satélite está oscilando nas profundezas urbanas... mas minha visão estilística é eterna. ";
      let recommendedProductIds: string[] = [];

      if (lastUserMessage.includes('goth') || lastUserMessage.includes('gotico') || lastUserMessage.includes('vasco') || lastUserMessage.includes('real')) {
        reply += "Para elevar a vibração gótica com camisas de time, a soberania do preto é indispensável. Recomendo equipar a lendária **Camisa Real Madrid - Dark Gothic** ou a **Camisa Vasco - Gótico Urbano**, e estruturar o visual com o robusto **Coturnos Dominator** e o **Choker Argola Pesada** de couro. Um verdadeiro manto sagrado da noite.";
        recommendedProductIds = ['real-goth', 'goth-boots', 'heavy-ring-choker'];
      } else if (lastUserMessage.includes('grunge') || lastUserMessage.includes('corinthians') || lastUserMessage.includes('estonada')) {
        reply += "O estilo Grunge underground prospera no desleixo planejado e acabamentos destruídos. A **Camisa Corinthians - Grunge Underground** estonada casa perfeitamente com sobreposições. Dica de ouro: monte-a com acessórios pesados do cabide.";
        recommendedProductIds = ['corinthians-grunge', 'goth-boots'];
      } else if (lastUserMessage.includes('cyber') || lastUserMessage.includes('techwear') || lastUserMessage.includes('chelsea') || lastUserMessage.includes('cargo')) {
        reply += "Seu look precisa de otimização de hardware tático. Combine a inovadora **Camisa Chelsea - Cyber Techwear** (com tecido inteligente e bolsos utilitários) com a icônica **Calça Cargo Shinobi** e finalize a blindagem óptica com o futurista **Óculos Neon Horizon** com feixes verdes neon.";
        recommendedProductIds = ['chelsea-techwear', 'cyber-cargo', 'cyber-visor'];
      } else if (lastUserMessage.includes('brasileirao') || lastUserMessage.includes('brasil')) {
        reply += "O futebol brasileiro respira estilo! Unir a cultura brasileira ao underground é sensacional. O manto do **Vasco - Gótico Urbano** ou a clássica **Camisa Seleção Brasileira - Neon Glow** criam um contraste eletrônico formidável de verde neon.";
        recommendedProductIds = ['vasco-goth', 'brasil-neon', 'cyber-visor'];
      } else {
        reply += "Bem-vindo ao quartel-general do estilo alternativo. Para fundar seu visual sagrado, recomendo selecionar uma camisa de destaque — como a imponente **Camisa Milan - Cyberpunk Neon** ou a **Camisa Chelsea - Cyber Techwear** — e harmonizar com calças táticas e acessórios cyberpunk. Diga-me qual liga ou estética (Gótico, Techwear, Grunge, Cyberpunk) quer explorar agora!";
        recommendedProductIds = ['milan-cyberpunk', 'cyber-cargo'];
      }

      return res.json({
        reply: reply + "\n\n*(Nota: ALT-BOT operando em modo offline devido à falta da chave GEMINI_API_KEY. Configure-a no menu de Segredos para ativar a IA viva!)*",
        recommendedProductIds,
      });
    }
  } catch (error: any) {
    console.error('General server error in stylist endpoint:', error);
    res.status(500).json({ error: 'Stylist system failure' });
  }
});

// Configure Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ALT-CLOSET server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
