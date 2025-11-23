'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Lock, Star, Zap, CheckCircle2 } from 'lucide-react';
import { generateCopyAction } from '@/app/actions';

export function CopyTool({ defaultNiche }: { defaultNiche: string }) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [niche, setNiche] = useState(defaultNiche || '');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  // Estado inicial 0 garante que começa como "Grátis" até ler o navegador
  const [freeUses, setFreeUses] = useState(0); 
  const [isVip, setIsVip] = useState(false);

  // SEU LINK DE PAGAMENTO
  const CHECKOUT_LINK = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=412d19310b5f4e60a60b366da10c0f92"; 
  
  // A SENHA QUE ESTÁ NO ACTIONS.TS (Tem que ser igualzinha)
  const SENHA_MESTRA_DO_SERVIDOR = "Xciooptydf1.!";

  // Carrega dados salvos ao abrir o site
  useEffect(() => {
    if (defaultNiche) setNiche(defaultNiche);
    
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedVip = localStorage.getItem('copyfactory_vip');
    
    if (savedUses) setFreeUses(parseInt(savedUses));
    if (savedVip === 'true') setIsVip(true);
  }, [defaultNiche]);

  const handleGenerate = async () => {
    // Lógica: Se usou menos de 1 vez, é teste grátis
    const isFreeTrial = freeUses < 1;
    
    // TRAVA DE SEGURANÇA: 
    // Se não é VIP, não é teste grátis e o campo de senha tá vazio = BLOQUEIA
    if (!isVip && !isFreeTrial && !accessCode) {
      setError('🔒 Seu teste grátis acabou. Adquira o acesso VIP para continuar.');
      return;
    }

    if (!niche || !topic) {
      setError('Preencha o nicho e o tópico do post.');
      return;
    }

    setLoading(true);
    setError('');
    
    // LÓGICA DE ENVIO DA SENHA (O Segredo está aqui)
    // Se for trial ou VIP, a gente "finge" que digitou a senha certa pro servidor aceitar.
    // Se não, a gente manda o que o usuário digitou no campo.
    const codeToSend = (isFreeTrial || isVip) ? SENHA_MESTRA_DO_SERVIDOR : accessCode;

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
      // Se deu erro de senha, remove o VIP (segurança)
      if (isVip) {
         setIsVip(false);
         localStorage.removeItem('copyfactory_vip');
      }
    } else if (result.data) {
      setGeneratedContent(result.data);
      
      // SUCESSO! Agora atualizamos o contador
      if (isFreeTrial) {
        const newUses = freeUses + 1;
        setFreeUses(newUses);
        localStorage.setItem('copyfactory_uses', newUses.toString());
      }
      
      // Se sucesso e NÃO era trial, significa que o usuário digitou a senha certa.
      // Então viramos ele VIP.
      if (!isFreeTrial && !result.error) {
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

  // Verifica se o usuário está bloqueado (sem créditos e sem VIP)
  const isLocked = !isVip && freeUses >= 1;

  return (
    <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-12">
      
      {/* COLUNA DA ESQUERDA - CONTROLES */}
      <div className="md:col-span-7 space-y-6">
        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                {isVip ? <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> : <Zap className="h-6 w-6 text-blue-600" />}
                {isVip ? "Modo Profissional" : "Criar Legenda"}
              </CardTitle>
              
              {/* ETIQUETA DE STATUS (PARA VOCÊ SABER SE O GRÁTIS TÁ VALENDO) */}
              {!isVip && freeUses < 1 && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold border border-green-200 animate-pulse uppercase tracking-wide">
                  Teste Grátis Ativo
                </span>
              )}
            </div>
            <CardDescription className="text-slate-500">
              Preencha os dados abaixo e deixe a IA escrever por você.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            
            {/* BLOCO DE VENDA (APARECE QUANDO BLOQUEIA) */}
            {isLocked && (
              <div className="bg-slate-50 p-6 rounded-xl border-2 border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="text-center space-y-1">
                  <h3 className="text-blue-900 font-bold text-lg flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Você atingiu o limite grátis!
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Libere acesso ilimitado e nunca mais sofra com bloqueio criativo.
                  </p>
                </div>

                <ul className="text-sm text-slate-600 space-y-2 pl-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Gerações Ilimitadas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Copywriting Persuasivo (AIDA)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Acesso Vitalício (Sem mensalidade)</li>
                </ul>

                <div className="pt-2 flex flex-col gap-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 shadow-lg shadow-green-200 transition-all hover:scale-[1.02]" 
                    onClick={() => window.open(CHECKOUT_LINK, '_blank')}
                  >
                    Liberar Acesso Agora (R$ 19,90)
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-500">Ou se já comprou</span></div>
                  </div>

                  <Input 
                    type="password" 
                    placeholder="Cole sua Senha VIP aqui..." 
                    value={accessCode} 
                    onChange={(e) => setAccessCode(e.target.value)} 
                    className="bg-white text-center border-blue-200 focus:border-blue-500" 
                  />
                </div>
              </div>
            )}

            {/* FORMULÁRIO */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Qual o seu Nicho?</Label>
                <Input 
                  value={niche} 
                  onChange={(e) => setNiche(e.target.value)} 
                  placeholder="Ex: Hamburgueria, Advogado, Petshop..." 
                  className="h-12 text-lg bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Qual o tema do post?</Label>
                <Textarea 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  placeholder="Ex: Promoção de Black Friday com 50% de desconto..." 
                  className="h-32 resize-none text-base bg-slate-50 leading-relaxed"
                />
                <p className="text-xs text-slate-400 text-right">Quanto mais detalhes, melhor a legenda.</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                <Lock className="w-4 h-4" /> {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              className={`w-full py-7 text-lg font-bold shadow-lg transition-all ${isLocked && !accessCode ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]'}`}
              disabled={loading || (isLocked && !accessCode)}
            >
              {loading ? (
                <span className="flex items-center gap-2">Escrevendo... <Sparkles className="w-4 h-4 animate-spin"/></span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> {isLocked && !accessCode ? 'Digite a Senha para Gerar' : 'Gerar Legenda Mágica'}</span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* COLUNA DA DIREITA - RESULTADO */}
      <div className="md:col-span-5 space-y-6">
        <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-2xl min-h-[400px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Resultado</span>
              {generatedContent && (
                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Pronto para postar</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="whitespace-pre-wrap text-slate-200 font-mono text-sm leading-relaxed p-2">
                  {generatedContent}
                </div>
                <Button onClick={copyToClipboard} variant="secondary" className="w-full mt-4 font-semibold hover:bg-white">
                  Copiar Legenda
                </Button>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 opacity-40 gap-4">
                <Sparkles className="h-12 w-12" />
                <p className="text-sm text-center max-w-[200px]">
                  O resultado da Inteligência Artificial aparecerá aqui...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* PROVA SOCIAL */}
        <div className="text-center space-y-2">
            <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-slate-400">Mais de 5.000 legendas geradas essa semana.</p>
        </div>
      </div>
    </div>
  );
}
