'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// DEFINA SUA SENHA AQUI (Pode mudar para o que quiser)
const SENHA_MESTRA = "VIP2025"; 

export async function generateCopyAction(niche: string, topic: string, accessCode: string) {
  
  // 1. A Grande Barreira: Verifica a senha antes de gastar 1 centavo de IA
  if (accessCode !== SENHA_MESTRA) {
    // Simula um delay para não facilitar força bruta
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { error: '⛔ Código de Acesso Inválido. Adquira sua licença para usar.' };
  }

  if (!process.env.GEMINI_API_KEY) {
    return { error: 'Erro interno de configuração.' };
  }

  if (!niche || !topic) {
    return { error: 'Preencha todos os campos.' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

    const prompt = `
      Você é um Copywriter Expert para: ${niche}.
      Tema: "${topic}".
      Crie uma legenda de Instagram AIDA (Atenção, Interesse, Desejo, Ação).
      Use emojis e hashtags. Seja persuasivo.
      Responda APENAS a legenda.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { success: true, data: response.text() };
  } catch (error: any) {
    console.error("Erro API:", error);
    return { error: 'Erro ao gerar. Tente novamente mais tarde.' };
  }
}
