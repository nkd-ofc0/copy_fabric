'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // O SEGREDO ESTÁ AQUI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy, Lock, Star } from 'lucide-react';
import { generateCopyAction } from '@/app/actions';

export default function DynamicPage() {
  // LER A URL DO JEITO SEGURO
  const params = useParams();
  const slug = params?.slug as string || '';
  
  // Formata o título (Ex: hamburgueria-artesanal -> Hamburgueria Artesanal)
  const displayTitle = slug.replace(/-/g, ' ').toUpperCase();

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [freeUses, setFreeUses] = useState(0);
  const [isVip, setIsVip] = useState(false);
  const CHECKOUT_LINK = "https://mercadopago.com.br"; 

  useEffect(() => {
    // Assim que carregar, preenche o nicho automaticamente baseado na URL
    if (displayTitle) setNiche(displayTitle);
    
    const savedUses = localStorage.getItem('copyfactory_uses');
    const savedVip = localStorage.getItem('copyfactory_vip');
    if (savedUses) setFreeUses(parseInt(savedUses));
    if (savedVip === 'true') setIsVip(true);
  }, [displayTitle]);

  const handleGenerate = async () => {
    const isFreeTrial = freeUses < 1;
    if (!isVip && !isFreeTrial && !accessCode) {
      setError('🔒 Teste grátis acabou. Digite a Senha VIP.');
      return;
    }
    if (!niche || !topic) {
      setError('Preencha nicho e tópico.');
      return;
    }

    setLoading(true);
    setError('');
    
    const senhaDoAction = "VIP2025"; 
    const codeToSend = isFreeTrial ? senhaDoAction : accessCode;

    const result = await generateCopyAction(niche, topic, codeToSend);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
           SEO Otimizado
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Gerador para <span className="text-blue-600">{displayTitle}</span>
        </h1>
      </div>

      <div className="grid gap-8 w-full max-w-6xl grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isVip ? <Star className="h-5 w-5 text-yellow-500" /> : <Lock className="h-5 w-5 text-blue-600" />}
                {isVip ? "Acesso VIP Ativo" : "Configurar Post"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isVip && freeUses >= 1 && (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 text-center space-y-3">
                  <h3 className="text-blue-900 font-bold text-lg">Teste grátis acabou!</h3>
                  <div className="flex flex-col gap-2">
                    <Input type="password" placeholder="Senha VIP..." value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="bg-white text-center" />
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.open(CHECKOUT_LINK, '_blank')}>Comprar Acesso</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Nicho (Automático)</Label>
                <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Hamburgueria..." />
              </div>
              <div className="space-y-2">
                <Label>Tópico</Label>
                <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Sobre o que é o post?" className="h-24 resize-none" />
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
            <CardHeader className="pb-2"><CardTitle>Resultado</CardTitle></CardHeader>
            <CardContent>
              {generatedContent ? <div className="whitespace-pre-wrap text-slate-200 font-mono text-xs">{generatedContent}</div> : <div className="h-40 flex items-center justify-center opacity-50"><p>O resultado aparecerá aqui...</p></div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-2xl mt-12 text-center text-slate-400 text-xs">
         URL Amigável: /legenda-para-{slug}
      </div>
    </div>
  );
}
