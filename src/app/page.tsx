'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Importamos o Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Lock } from 'lucide-react';
import { generateCopyAction } from './actions';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [accessCode, setAccessCode] = useState(''); // Estado para a senha
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!accessCode) {
      setError('🔒 Digite seu Código de Acesso para continuar.');
      return;
    }
    if (!niche || !topic) {
      setError('Por favor, preencha o nicho e o tópico.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent('');

    // Enviamos a senha junto com o pedido
    const result = await generateCopyAction(niche, topic, accessCode);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copiado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          CopyFactory <span className="text-blue-600">Pro</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Ferramenta exclusiva para membros.
        </p>
      </div>

      <div className="grid gap-8 w-full max-w-5xl grid-cols-1 md:grid-cols-2">
        
        {/* INPUTS */}
        <Card className="border-slate-200 shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" /> Área do Assinante
            </CardTitle>
            <CardDescription>Insira seus dados para gerar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* CAMPO DE SENHA NOVO */}
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 space-y-2">
              <Label htmlFor="code" className="text-yellow-800 font-bold">Código de Acesso VIP</Label>
              <Input 
                id="code" 
                type="password"
                placeholder="Digite seu código aqui..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Nicho</Label>
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
              <Label htmlFor="topic">Tópico</Label>
              <Textarea 
                id="topic" 
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
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold"
              disabled={loading}
            >
              {loading ? 'Validando e Gerando...' : '✨ Gerar Agora'}
            </Button>
          </CardContent>
        </Card>

        {/* OUTPUT */}
        <Card className="bg-slate-950 text-slate-50 border-slate-800 shadow-xl min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Resultado</span>
              {generatedContent && (
                <Button onClick={copyToClipboard} variant="ghost" size="sm">
                  <Copy className="h-4 w-4 mr-1" /> Copiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="whitespace-pre-wrap text-slate-200 font-mono text-sm">
                {generatedContent}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 opacity-50">
                <Lock className="h-12 w-12 mb-2" />
                <p>Aguardando validação...</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
