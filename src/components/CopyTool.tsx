'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, Star, Zap, Check } from 'lucide-react';
import { generateCopyAction } from '@/app/actions';

export function CopyTool({ defaultNiche }: { defaultNiche: string }) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [niche, setNiche] = useState(defaultNiche || '');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  // Estados
  const [freeUses, setFreeUses] = useState(0);
  const [isVip, setIsVip] = useState(false);

  // CONFIGURAÇÕES
  const CHECKOUT_LINK = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=412d19310b5f4e60a60b366da10c0f92"; 
  const SENHA_MESTRA_DO_SERVIDOR = "Xciooptydf1.!";

  useEffect(() => {
    if (defaultNiche) setNiche(defaultNiche);
    
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedVip = localStorage.getItem('copyfactory_vip');
    
    if (savedUses) setFreeUses(parseInt(savedUses || '0'));
    if (savedVip === 'true') setIsVip(true);
  }, [defaultNiche]);

  const handleGenerate = async () => {
    // LER ESTADO ATUALIZADO
    const currentUses = parseInt(localStorage.getItem('copyfactory_uses') || '0');
    const currentVip = localStorage.getItem('copyfactory_vip') === 'true';
    
    if (currentUses !== freeUses) setFreeUses(currentUses);
    if (currentVip !== isVip) setIsVip(currentVip);

    const userProvidedPassword = accessCode.trim();
    const isFreeTrial = currentUses < 1;

    // TRAVA DE BLOQUEIO
    if (!currentVip && !isFreeTrial && !userProvidedPassword) {
      setError('🔒 Limite grátis atingido. Apoie o projeto para continuar.');
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
    <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-12">
      
      <div className="md:col-span-7 space-y-6">
        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                {isVip ? <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> : <Zap className="h-6 w-6 text-blue-600 fill-blue-100" />}
                {isVip ? "Modo VIP Ativo" : "Gerador Viral AI"}
              </CardTitle>
              
              {!isVip && freeUses === 0 && (
                <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold border border-green-200 uppercase tracking-wide animate-pulse">
                  Teste Grátis Disponível
                </span>
              )}
            </div>
            
            <div className="space-y-2 pt-2">
              <p className="text-slate-600 leading-relaxed text-sm">
                Nossa Inteligência Artificial cria legendas persuasivas, com gatilhos mentais e emojis, em segundos.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            
            {/* BLOCO DE VENDA */}
            {isLocked && (
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2 shadow-inner">
                <div className="text-center space-y-2">
                  <h3 className="text-blue-900 font-black text-xl flex items-center justify-center gap-2 uppercase tracking-tight">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Gostou da ferramenta?
                  </h3>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed max-w-md mx-auto">
                    Apoie a gente e assine o CopyFactory para poupar horas de bloqueio criativo e produza copys ilimitadas como um expert.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 py-2">
                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100"><Check className="w-4 h-4 text-green-600"/> Gerações Ilimitadas</div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100"><Check className="w-4 h-4 text-green-600"/> Atualizações VIP</div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-lg shadow-green-200 transition-all hover:scale-[1.02]" 
                    onClick={() => window.open(CHECKOUT_LINK, '_blank')}
                  >
                    QUERO SER EXPERT (R$ 16,90)
                  </Button>
                  
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300/50" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-blue-50 px-2 text-slate-400">Área de Membros</span></div>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 focus-within:border-blue-400 transition-colors">
                    <Lock className="ml-2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="Já tem a senha? Digite aqui..." 
                      value={accessCode} 
                      onChange={(e) => setAccessCode(e.target.value)} 
                      className="border-none focus-visible:ring-0 bg-transparent h-10 text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={`space-y-4 ${isLocked ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Qual o seu Nicho?</Label>
                <Input 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="Ex: Hamburgueria, Advogado, Petshop..." 
                  className="h-12 text-lg bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Sobre o que é o post?</Label>
                <Textarea 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  placeholder="Descreva o conteúdo, promoção ou dica..." 
                  className="h-32 resize-none text-base bg-slate-50"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-1">
                <Lock className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Se NÃO estiver bloqueado, mostra o botão de gerar */}
            {!isLocked && (
                <Button 
                onClick={handleGenerate} 
                className="w-full py-7 text-lg font-bold shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] transition-all"
                disabled={loading}
                >
                {loading ? (
                    <span className="flex items-center gap-2">Escrevendo... <Sparkles className="w-4 h-4 animate-spin"/></span>
                ) : (
                    <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Gerar Legenda Grátis</span>
                )}
                </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-5 space-y-6">
        <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-2xl min-h-[500px] relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Resultado</span>
              {generatedContent && (
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">Pronto</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {generatedContent ? (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                  {generatedContent}
                </div>
                <Button onClick={copyToClipboard} variant="secondary" className="w-full mt-auto font-bold hover:bg-white transition-colors">
                  Copiar Texto
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm text-center max-w-[200px] leading-relaxed">
                  {isLocked ? "🔒 Aguardando desbloqueio..." : "Aguardando você preencher os dados ao lado..."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
