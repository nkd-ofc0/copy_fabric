'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, Star, Zap, ShieldCheck, Clock } from 'lucide-react';
import { generateCopyAction } from '@/app/actions';

export function CopyTool({ defaultNiche }: { defaultNiche: string }) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [niche, setNiche] = useState(defaultNiche || '');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [freeUses, setFreeUses] = useState(0);
  const [isVip, setIsVip] = useState(false);

  // SEU LINK DE PAGAMENTO
  const CHECKOUT_LINK = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=412d19310b5f4e60a60b366da10c0f92"; 
  const SENHA_MESTRA_DO_SERVIDOR = "Xciooptydf1.!";

  useEffect(() => {
    if (defaultNiche) setNiche(defaultNiche);
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedVip = localStorage.getItem('copyfactory_vip');
    if (savedUses) setFreeUses(parseInt(savedUses));
    if (savedVip === 'true') setIsVip(true);
  }, [defaultNiche]);

  const handleGenerate = async () => {
    const isFreeTrial = freeUses < 1;
    
    // Se o usuário digitou uma senha, vamos tentar usar ela PRIORITARIAMENTE
    const userProvidedPassword = accessCode.trim();

    // Bloqueio: Se não é VIP, não é trial e não digitou senha
    if (!isVip && !isFreeTrial && !userProvidedPassword) {
      setError('🔒 Limite grátis atingido. Insira sua Senha VIP para continuar.');
      return;
    }
    if (!niche || !topic) {
      setError('Por favor, preencha o nicho e o tópico.');
      return;
    }

    setLoading(true);
    setError('');
    
    // Lógica de Senha: Se o usuário digitou, usa a dele. Se não, usa a do sistema (se for trial/vip)
    const codeToSend = userProvidedPassword || ((isFreeTrial || isVip) ? SENHA_MESTRA_DO_SERVIDOR : '');

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
      if (isVip) {
         setIsVip(false);
         localStorage.removeItem('copyfactory_vip');
      }
    } else if (result.data) {
      setGeneratedContent(result.data);
      
      // Se era trial e não tinha senha, gasta o trial
      if (isFreeTrial && !userProvidedPassword) {
        const newUses = freeUses + 1;
        setFreeUses(newUses);
        localStorage.setItem('copyfactory_uses', newUses.toString());
      }
      
      // Se funcionou, marca como VIP
      if (!result.error) {
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
              {!isVip && freeUses < 1 && (
                <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold border border-green-200 uppercase tracking-wide">
                  Teste Grátis Disponível
                </span>
              )}
            </div>
            
            {/* COPY DE MARKETING AQUI */}
            <div className="space-y-2 pt-2">
              <p className="text-slate-600 leading-relaxed">
                Chega de encarar a tela em branco. Nossa Inteligência Artificial cria legendas persuasivas, com gatilhos mentais e emojis, em segundos.
              </p>
              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Economize 5h/semana</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Copywriting Validado</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Qual o seu Nicho?</Label>
                <Input 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="Ex: Hamburgueria, Advogado, Petshop..." 
                  className="h-12 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Sobre o que é o post?</Label>
                <Textarea 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  placeholder="Descreva o conteúdo, promoção ou dica..." 
                  className="h-32 resize-none text-base bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* ÁREA DE LOGIN SEMPRE VISÍVEL MAS DISCRETA */}
            {!isVip && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Já é membro VIP?
                  </Label>
                  <button 
                    onClick={() => window.open(CHECKOUT_LINK, '_blank')}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Não tenho senha (Comprar)
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="Digite sua Senha VIP aqui..." 
                    value={accessCode} 
                    onChange={(e) => setAccessCode(e.target.value)} 
                    className="pl-9 bg-white border-slate-200" 
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-1">
                <Lock className="w-4 h-4" /> {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              className="w-full py-7 text-lg font-bold shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">Escrevendo sua legenda... <Sparkles className="w-4 h-4 animate-spin"/></span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Gerar Legenda Mágica</span>
              )}
            </Button>
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
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">Pronto para postar</span>
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
                  Aguardando você preencher os dados ao lado...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
