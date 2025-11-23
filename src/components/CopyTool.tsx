'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, Star, Zap, CheckCircle2, Crown, KeyRound, LogIn, History, Copy, Trash2, Eye } from 'lucide-react';
import { generateCopyAction } from '@/app/actions';

// Tipo do Histórico
type HistoryItem = {
  id: number;
  niche: string;
  topic: string;
  content: string;
  date: string;
};

export function CopyTool({ defaultNiche }: { defaultNiche: string }) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [niche, setNiche] = useState(defaultNiche || '');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState(''); 
  const [error, setError] = useState('');
  
  const [freeUses, setFreeUses] = useState(0);
  const [isVip, setIsVip] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const CHECKOUT_LINK = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=412d19310b5f4e60a60b366da10c0f92"; 
  const SENHA_MESTRA_DO_SERVIDOR = "Xciooptydf1.!"; 

  useEffect(() => {
    if (defaultNiche) setNiche(defaultNiche);
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedVip = localStorage.getItem('copyfactory_vip');
    const savedHistory = localStorage.getItem('copyfactory_history');
    
    if (savedUses) setFreeUses(parseInt(savedUses || '0'));
    if (savedVip === 'true') setIsVip(true);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [defaultNiche]);

  const saveToHistory = (nicheText: string, topicText: string, contentText: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      niche: nicheText,
      topic: topicText,
      content: contentText,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('copyfactory_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('copyfactory_history');
  }

  const handleLogin = () => {
    if (accessCode === SENHA_MESTRA_DO_SERVIDOR) {
      setIsVip(true);
      localStorage.setItem('copyfactory_vip', 'true');
      setError('');
      alert("Acesso VIP Liberado com Sucesso! 🚀");
    } else {
      setError("Senha incorreta.");
    }
  };

  const handleGenerate = async () => {
    const currentUses = parseInt(localStorage.getItem('copyfactory_uses') || '0');
    const currentVip = localStorage.getItem('copyfactory_vip') === 'true';
    const isFreeTrial = currentUses < 1;

    if (currentUses !== freeUses) setFreeUses(currentUses);
    if (currentVip !== isVip) setIsVip(currentVip);

    const userProvidedPassword = accessCode.trim();

    if (!currentVip && !isFreeTrial && !userProvidedPassword) {
      setError('🔒 Teste acabou. Apoie o projeto para continuar.');
      setFreeUses(currentUses); 
      return;
    }

    if (!niche || !topic) {
      setError('Por favor, preencha o nicho e o tópico.');
      return;
    }

    setLoading(true);
    setError('');
    
    const codeToSend = userProvidedPassword || ((isFreeTrial || currentVip) ? SENHA_MESTRA_DO_SERVIDOR : '');

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
      if (currentVip) {
         setIsVip(false);
         localStorage.removeItem('copyfactory_vip');
      }
    } else if (result.data) {
      setGeneratedContent(result.data);
      saveToHistory(niche, topic, result.data);
      
      if (isFreeTrial && !userProvidedPassword) {
        const newUses = currentUses + 1;
        setFreeUses(newUses);
        localStorage.setItem('copyfactory_uses', newUses.toString());
      }
      if (!result.error && userProvidedPassword) {
        setIsVip(true);
        localStorage.setItem('copyfactory_vip', 'true');
      }
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Legenda copiada!');
  };

  const isLocked = !isVip && freeUses >= 1;

  return (
    <div className="grid gap-6 w-full max-w-6xl grid-cols-1 md:grid-cols-12 items-start">
      
      {/* --- ESQUERDA --- */}
      <div className="md:col-span-7 space-y-4">
        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 px-5 pt-5">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                {isVip ? <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> : <Zap className="h-5 w-5 text-blue-600 fill-blue-100" />}
                {isVip ? "Membro VIP" : "Gerador Viral AI"}
              </CardTitle>
              {!isVip && freeUses === 0 && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200 uppercase tracking-wide animate-pulse">
                  Teste Grátis
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Transforme ideias simples em legendas virais. Economize tempo.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-5 py-5">
            {!isVip && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2 flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                    Já é membro?
                  </Label>
                  <Input type="password" placeholder="Senha VIP..." value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="bg-white h-9 text-sm" />
                </div>
                <Button onClick={handleLogin} className="bg-slate-800 hover:bg-slate-900 text-white h-9 px-4">
                  <LogIn className="w-4 h-4" />
                </Button>
              </div>
            )}

            {isLocked && (
              <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-100 space-y-3 animate-in fade-in zoom-in-95 shadow-inner text-center">
                <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500 mx-auto" />
                <div>
                  <h3 className="text-blue-900 font-bold text-base">Limite Grátis Atingido</h3>
                  <p className="text-slate-600 text-xs mt-1 max-w-xs mx-auto">
                    Gostou? Tenha acesso ilimitado e crie quantas copys quiser.
                  </p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-base shadow-md transition-all hover:scale-[1.02]" onClick={() => window.open(CHECKOUT_LINK, '_blank')}>
                  QUERO SER VIP (R$ 16,90)
                </Button>
              </div>
            )}

            <div className={`space-y-3 ${isLocked ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              <div className="space-y-1">
                <Label className="text-slate-700 font-bold text-xs">Nicho</Label>
                <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Hamburgueria..." className="h-10 text-sm bg-slate-50" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-700 font-bold text-xs">Sobre o post</Label>
                <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Descreva o conteúdo..." className="h-24 resize-none text-sm bg-slate-50" />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-2 rounded text-xs font-medium border border-red-100 flex items-center gap-2"><Lock className="w-3 h-3" /> {error}</div>}

            {!isLocked && (
                <Button onClick={handleGenerate} className="w-full py-6 text-base font-bold shadow-md bg-blue-600 hover:bg-blue-700 transition-all" disabled={loading}>
                {loading ? <span className="flex items-center gap-2">Criando... <Sparkles className="w-4 h-4 animate-spin"/></span> : <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gerar Legenda</span>}
                </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- DIREITA --- */}
      <div className="md:col-span-5 space-y-4">
        
        {/* PREVIEW */}
        <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col h-[420px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2 border-b border-slate-800 px-4 pt-4">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Resultado</span>
              {generatedContent && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">Pronto</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                {generatedContent ? (
                  <div className="whitespace-pre-wrap text-slate-300 font-mono text-xs leading-relaxed">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center"><Sparkles className="h-5 w-5 opacity-50" /></div>
                    <p className="text-xs text-center max-w-[180px] leading-relaxed">{isLocked ? "🔒 Bloqueado" : "O texto aparecerá aqui..."}</p>
                  </div>
                )}
            </div>
            {generatedContent && (
                <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0">
                    <Button onClick={copyToClipboard} variant="secondary" size="sm" className="w-full font-bold hover:bg-white text-xs h-8">
                        Copiar Texto
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* HISTÓRICO */}
        <Card className="border-slate-200 bg-slate-50 shadow-sm">
            <CardHeader className="py-2 border-b border-slate-200 bg-white rounded-t-lg flex flex-row items-center justify-between px-4">
              <CardTitle className="text-xs flex items-center gap-2 text-slate-700 font-bold">
                <History className="h-3 w-3 text-blue-500" /> Histórico
              </CardTitle>
              {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-1 hover:underline">
                      <Trash2 className="w-3 h-3" /> Limpar
                  </button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {history.length > 0 ? (
                  <div className="max-h-[150px] overflow-y-auto">
                    {history.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setGeneratedContent(item.content)}
                            className="group flex items-center justify-between p-2 bg-white border-b border-slate-100 hover:bg-blue-50 transition-all cursor-pointer px-4"
                        >
                            <div className="overflow-hidden pr-2">
                                <p className="font-bold text-[10px] text-slate-700 truncate w-40">{item.topic}</p>
                                <p className="text-[9px] text-slate-400 flex gap-2">
                                <span className="bg-slate-100 px-1 rounded border border-slate-200">{item.niche}</span> 
                                <span>{item.date}</span>
                                </p>
                            </div>
                            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <Eye className="h-3 w-3" />
                            </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="p-4 text-center text-slate-400 flex flex-col items-center gap-1">
                      <p className="text-[10px] font-medium">Histórico vazio.</p>
                  </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
