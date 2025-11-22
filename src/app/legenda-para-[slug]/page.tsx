import { Metadata } from 'next';
import { CopyTool } from '@/components/CopyTool';

// Auxiliar para formatar texto
function formatSlug(slug: string) {
  if (!slug) return "Negócio";
  return slug.replace(/-/g, ' ').toUpperCase();
}

// Tipagem correta para Next.js 15
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Gera o Título pro Google (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Next 15 exige await aqui
  const title = formatSlug(resolvedParams.slug);

  return {
    title: `Gerador de Legenda para ${title} - IA Grátis`,
    description: `Crie posts para ${title} em segundos usando Inteligência Artificial.`,
  };
}

// 2. A Página que o usuário vê
export default async function Page({ params }: Props) {
  const resolvedParams = await params; // Next 15 exige await aqui também
  const displayTitle = formatSlug(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
       <div className="text-center mb-10 max-w-2xl">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
           SEO Otimizado
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Gerador para <span className="text-blue-600">{displayTitle}</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Ferramenta Especializada
        </p>
      </div>

      {/* Aqui chamamos o componente "Cliente" e passamos o texto pra ele */}
      <CopyTool defaultNiche={displayTitle} />

      <div className="max-w-2xl mt-12 text-center text-slate-400 text-xs">
         URL: /legenda-para-{resolvedParams.slug}
      </div>
    </div>
  );
}
