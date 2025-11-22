'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Lock, History, Star } from 'lucide-react';
import { generateCopyAction } from '@/app/actions'; // Note o @ para importar certo de qualquer lugar

// Aceita um nicho padrão vindo da URL (SEO)
interface CopyToolProps {
  defaultNiche?: string;
}

type HistoryItem = {
  id: number;
  niche: string;
  topic: string;
  content: string;
  date: string;
};

export function CopyTool({ defaultNiche }: CopyToolProps) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [niche, setNiche] = useState(defaultNiche || ''); // Usa o nicho da URL se existir
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [freeUses, setFreeUses] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isVip, setIsVip] = useState(false);

  const CHECKOUT_LINK = "https://seu-link-checkout.com"; // Troque pelo seu

  useEffect(() => {
    // Se veio um nicho da URL, já seta ele
    if (defaultNiche) setNiche(defaultNiche);

    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedHistory = localStorage.getItem('copyfactory_history');
    const savedVip = localStorage.getItem('copyfactory_vip');

    if (savedUses) setFreeUses(parseInt(savedUses));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedVip === 'true') setIsVip(true);
  }, [defaultNiche]);

  const saveToHistory = (niche: string, topic: string, content: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      niche,
      topic,
      content,
      date: new Date().toLocaleTimeString()
    };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('copyfactory_history', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    const isFreeTrial = freeUses < 1;
    
    if (!isVip && !isFreeTrial && !accessCode) {
      setError('🔒 Seu teste grátis acabou. Digite o Código VIP.');
      return;
    }

    if (!niche || !topic) {
      setError('Preencha nicho e tópico.');
      return;
    }

    setLoading(true);
    setError('');
    
    // ATENÇÃO: COLOQUE SUA SENHA CORRETA DO ACTION AQUI
    const senhaCorretaDoAction = "VIP2025"; 
    const codeToSend = isFreeTrial ? senhaCorretaDoAction : accessCode;

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
      saveToHistory(niche, topic, result.data);
      
      if (isFreeTrial) {
        const newUses = freeUses + 1;
        setFreeUses(newUses);
        localStorage.setItem('copyfactory_uses', newUses.toString());
      }
      
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

  // RENDERIZAÇÃO SIMPLIFICADA (Mesmo visual)
  return (
    <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-12">
      <div className="md:col-span-7 space-y-6">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isVip ? <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> : <Lock className="h-5 w-5 text-blue-600" />}
              {isVip ? "Acesso VIP Ativo" : "Configurar Post"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {!isVip && freeUses >= 1 && (
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center space-y-3">
                <h3 className="text-blue-900 font-bold text-lg">Teste grátis acabou! 🚀</h3>
                <div className="flex flex-col gap-2">
                  <Input 
                    type="password"
                    placeholder="Senha VIP..."
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="bg-white text-center"
                  />
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.open(CHECKOUT_LINK, '_blank')}>
                    Comprar Acesso
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Nicho</Label>
              {/* Se veio nicho da URL, mostra ele travado ou selecionado */}
              <Input 
                 value={niche} 
                 onChange={(e) => setNiche(e.target.value)} 
                 placeholder="Ex: Hamburgueria, Advogado..."
              />
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

            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-200">{error}</div>}

            <Button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold text-lg" disabled={loading}>
              {loading ? 'Criando...' : '✨ Gerar Legenda'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-5 space-y-6">
        <Card className="bg-slate-950 text-slate-50 border-slate-800 shadow-xl min-h-[300px]">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between text-base">
              <span>Resultado</span>
              {generatedContent && (
                <Button onClick={() => copyToClipboard(generatedContent)} variant="ghost" size="sm" className="h-8">
                  <Copy className="h-4 w-4 mr-1" /> Copiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="whitespace-pre-wrap text-slate-200 font-mono text-xs leading-relaxed">{generatedContent}</div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 opacity-50">
                <Sparkles className="h-8 w-8 mb-2" />
                <p className="text-sm">O resultado aparecerá aqui...</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {history.length > 0 && (
            <div className="text-xs text-slate-400 text-center">Histórico salvo no navegador</div>
        )}
      </div>
    </div>
  );
}
