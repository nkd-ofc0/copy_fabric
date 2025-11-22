'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializa a API com sua chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateCopyAction(niche: string, topic: string) {
  // Verificação de segurança da chave
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'Chave de API não configurada no servidor.' };
  }

  if (!niche || !topic) {
    return { error: 'Por favor, preencha o nicho e o tópico.' };
  }

  try {
    // CORREÇÃO AQUI: Mudamos para 'gemini-1.5-flash-latest' que é mais estável
    // Se der erro de novo, mudaremos para 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Você é um Copywriter Expert especializado em vendas no Instagram para o nicho de: ${niche}.
      
      Sua tarefa: Criar uma legenda de Instagram altamente persuasiva sobre o tema: "${topic}".
      
      Regras Obrigatórias:
      1. Use a estrutura AIDA (Atenção, Interesse, Desejo, Ação).
      2. O tom deve ser engajador e direto, use emojis estrategicamente.
      3. Comece com uma "Headline" (Gancho) impactante nas primeiras 2 linhas.
      4. Inclua uma Chamada para Ação (CTA) clara no final.
      5. Adicione 5 hashtags relevantes ao final.
      
      Responda APENAS com o texto da legenda.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Erro detalhado da API:", error);
    
    // Tratamento de erro mais amigável
    let msg = 'Falha ao gerar copy.';
    if (error.message?.includes('404')) msg = 'Modelo de IA não encontrado ou indisponível na região.';
    if (error.message?.includes('API key')) msg = 'Problema com a Chave da API.';

    return { error: msg };
  }
}