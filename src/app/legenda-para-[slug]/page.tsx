import { Metadata } from 'next';
import { CopyTool } from '@/components/CopyTool';

// Função para deixar o título bonito
function formatSlug(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// DEFINIÇÃO DO TIPO (Isso corrige o erro vermelho)
type Props = {
  params: Promise<{ slug: string }>
}

// 1. GERA O TÍTULO (Com await)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // O SEGREDO ESTÁ AQUI
  const title = formatSlug(resolvedParams.slug);

  return {
    title: `Gerador de Legenda para ${title} - IA Grátis`,
    description: `Crie posts para ${title} em segundos. Ferramenta de IA gratuita.`,
  };
}

// 2. A PÁGINA (Agora é async e usa await)
export default async function NichePage({ params }: Props) {
  const resolvedParams = await params; // O SEGREDO ESTÁ AQUI TAMBÉM
  const displayTitle = formatSlug(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
       <div className="text-center mb-10 max-w-2xl">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
           Ferramenta Especializada
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Gerador de Legenda para <span className="text-blue-600">{displayTitle}</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Otimizado para o seu nicho.
        </p>
      </div>

      {/* Passamos o título da URL direto para a ferramenta */}
      <CopyTool defaultNiche={displayTitle} />

      <div className="max-w-2xl mt-12 text-center text-slate-400 text-xs">
         SEO Otimizado: /legenda-para-{resolvedParams.slug}
      </div>
    </div>
  );
}
