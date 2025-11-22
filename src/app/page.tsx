'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Lock, History, Star } from 'lucide-react';
import { generateCopyAction } from './actions';

// TIPO PARA O HISTÓRICO
type HistoryItem = {
  id: number;
  niche: string;
  topic: string;
  content: string;
  date: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  // NOVOS ESTADOS
  const [freeUses, setFreeUses] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isVip, setIsVip] = useState(false);

  // LINK DO SEU CHECKOUT (Depois trocaremos pelo real do Mercado Pago)
  const CHECKOUT_LINK = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=412d19310b5f4e60a60b366da10c0f92 ";

  // Carregar dados salvos ao abrir o site
  useEffect(() => {
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedHistory = localStorage.getItem('copyfactory_history');
    const savedVip = localStorage.getItem('copyfactory_vip');

    if (savedUses) setFreeUses(parseInt(savedUses));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedVip === 'true') setIsVip(true);
  }, []);

  const saveToHistory = (niche: string, topic: string, content: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      niche,
      topic,
      content,
      date: new Date().toLocaleTimeString()
    };
    const newHistory = [newItem, ...history].slice(0, 5); // Guarda só os últimos 5
    setHistory(newHistory);
    localStorage.setItem('copyfactory_history', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    // LÓGICA DO FREEMIUM
    const isFreeTrial = freeUses < 1; // Permite 1 uso grátis
    
    // Se não for VIP e já gastou o grátis, exige senha
    if (!isVip && !isFreeTrial && !accessCode) {
      setError('🔒 Seu teste grátis acabou. Digite o Código VIP para continuar.');
      return;
    }

    if (!niche || !topic) {
      setError('Por favor, preencha o nicho e o tópico.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent('');

    // Se for teste grátis, usa a senha mestra internamente (hardcoded no front só pra passar)
    // ATENÇÃO: Num app real complexo, isso seria validado no back. Pro MVP serve.
    const codeToSend = isFreeTrial ? "Xciooptydf1.!" : accessCode;

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
      // Se a senha estiver errada, não conta uso
    } else if (result.data) {
      setGeneratedContent(result.data);
      saveToHistory(niche, topic, result.data);
      
      // Se usou o grátis, incrementa e salva
      if (isFreeTrial) {
        const newUses = freeUses + 1;
        setFreeUses(newUses);
        localStorage.setItem('copyfactory_uses', newUses.toString());
      }
      
      // Se usou senha válida, marca como VIP no navegador pra não pedir senha toda hora
      if (!isFreeTrial && !result.error) {
        setIsVip(true);
        localStorage.setItem('copyfactory_vip', 'true');
      }
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          CopyFactory <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-slate-600 text-lg">
          {freeUses === 0 ? "Teste grátis agora!" : "Ferramenta Profissional de Copywriting"}
        </p>
      </div>

      <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-12">
        
        {/* COLUNA ESQUERDA - INPUTS (Ocupa 7 colunas) */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isVip ? <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> : <Lock className="h-5 w-5 text-blue-600" />}
                {isVip ? "Acesso VIP Ativo" : "Configurar Post"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* BLOCO DE BLOQUEIO / VENDA */}
              {!isVip && freeUses >= 1 && (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center space-y-3">
                  <h3 className="text-blue-900 font-bold text-lg">Seu teste grátis acabou! 🚀</h3>
                  <p className="text-blue-700 text-sm">Adquira o acesso ilimitado para continuar gerando vendas.</p>
                  
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="password"
                      placeholder="Já tem a senha? Digite aqui..."
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="bg-white text-center"
                    />
                    <div className="text-xs text-slate-400">OU</div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 font-bold animate-pulse"
                      onClick={() => window.open(CHECKOUT_LINK, '_blank')}
                    >
                      Comprar Acesso (R$ 16,90)
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Nicho</Label>
                <Select onValueChange={setNiche}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gastronomia">🍔 Gastronomia</SelectItem>
                    <SelectItem value="Estética">💅 Estética</SelectItem>
                    <SelectItem value="Imobiliário">🏠 Imobiliário</SelectItem>
                    <SelectItem value="Advocacia">⚖️ Advocacia</SelectItem>
                    <SelectItem value="Fitness">💪 Fitness</SelectItem>
                    <SelectItem value="Marketing">🚀 Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tópico</Label>
                <Textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Sobre o que é o post?"
                  className="h-24 resize-none"
                />
              </div>

              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-200">
                  🚨 {error}
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold text-lg"
                disabled={loading}
              >
                {loading ? 'Criando Mágica...' : '✨ Gerar Legenda'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA - RESULTADO + HISTÓRICO (Ocupa 5 colunas) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Resultado Atual */}
          <Card className="bg-slate-950 text-slate-50 border-slate-800 shadow-xl min-h-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between text-base">
                <span>Resultado Atual</span>
                {generatedContent && (
                  <Button onClick={() => copyToClipboard(generatedContent)} variant="ghost" size="sm" className="h-8">
                    <Copy className="h-4 w-4 mr-1" /> Copiar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="whitespace-pre-wrap text-slate-200 font-mono text-xs leading-relaxed">
                  {generatedContent}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <Sparkles className="h-8 w-8 mb-2" />
                  <p className="text-sm">O resultado aparecerá aqui...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico Recente */}
          {history.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-500">
                  <History className="h-4 w-4" /> Últimas Gerações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-slate-700 truncate">{item.niche} - {item.topic}</p>
                      <p className="text-[10px] text-slate-400">{item.date}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => copyToClipboard(item.content)}
                    >
                      <Copy className="h-3 w-3 text-blue-600" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
