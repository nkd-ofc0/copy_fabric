import { Metadata } from 'next';
import { CopyTool } from '@/components/CopyTool';

function formatSlug(slug: string) {
  if (!slug) return "Negócio";
  const decoded = decodeURIComponent(slug);
  return decoded.replace(/-/g, ' ').toUpperCase();
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const title = formatSlug(resolvedParams.slug);

  return {
    title: `Gerador de Legenda para ${title} - IA Grátis`,
    description: `Ferramenta de Inteligência Artificial para criar posts de ${title}.`,
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
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
      </div>

      <CopyTool defaultNiche={displayTitle} />

      <div className="max-w-2xl mt-12 text-center text-slate-400 text-xs">
         URL: /legenda/{resolvedParams.slug}
      </div>
    </div>
  );
}
