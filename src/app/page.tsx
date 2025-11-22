'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, AlertCircle } from 'lucide-react';
import { generateCopyAction } from './actions'; // Importamos nossa função do servidor

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    // Validação simples
    if (!niche || !topic) {
      setError('Por favor, selecione um nicho e digite um tópico.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent('');

    // Chama a função do servidor (Gemini)
    const result = await generateCopyAction(niche, topic);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          CopyFactory <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Gere legendas que vendem em segundos. Sem bloqueio criativo.
        </p>
      </div>

      <div className="grid gap-8 w-full max-w-5xl grid-cols-1 md:grid-cols-2">
        
        {/* INPUTS */}
        <Card className="border-slate-200 shadow-lg h-fit">
          <CardHeader>
            <CardTitle>Configurar Post</CardTitle>
            <CardDescription>Defina o seu alvo para a IA calibrar a linguagem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="niche">Qual é o seu Nicho?</Label>
              <Select onValueChange={setNiche}>
                <SelectTrigger id="niche">
                  <SelectValue placeholder="Selecione a área..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gastronomia">🍔 Gastronomia & Delivery</SelectItem>
                  <SelectItem value="Estética">💅 Estética & Beleza</SelectItem>
                  <SelectItem value="Imobiliário">🏠 Imobiliário</SelectItem>
                  <SelectItem value="Advocacia">⚖️ Advocacia</SelectItem>
                  <SelectItem value="Fitness">💪 Fitness & Saúde</SelectItem>
                  <SelectItem value="Marketing">🚀 Marketing Digital</SelectItem>
                  <SelectItem value="Loja de Roupas">👗 Moda & Varejo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Sobre o que é o post?</Label>
              <Textarea 
                id="topic" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Promoção de pizza em dobro na terça-feira..."
                className="h-32 resize-none"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 font-semibold transition-all hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <>Criando estratégia...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Gerar Legenda Vendedora</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* OUTPUT */}
        <Card className="bg-slate-950 text-slate-50 border-slate-800 shadow-xl h-full min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultado</span>
              {generatedContent && (
                <Button 
                  onClick={copyToClipboard}
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Copy className="h-4 w-4 mr-1" /> Copiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-mono text-sm animate-in fade-in duration-500">
                {generatedContent}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg mt-10">
                <Sparkles className="h-10 w-10 mb-3 opacity-20" />
                <p className="opacity-50 text-center px-4">Preencha ao lado e veja a mágica acontecer...</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}