import { Metadata } from 'next';
import { niches } from '@/lib/niches';
import { CopyTool } from '@/components/CopyTool'; // AGORA IMPORTAMOS O COMPONENTE CERTO

export async function generateStaticParams() {
  return niches.map((niche) => ({
    slug: niche.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const nicheData = niches.find((n) => n.slug === params.slug);
  const title = nicheData ? nicheData.title : 'Negócios';

  return {
    title: `Gerador de Legenda para ${title} - IA Grátis`,
    description: `Crie posts para ${title} em segundos.`,
  };
}

export default function NichePage({ params }: { params: { slug: string } }) {
  // Pegamos o título bonito da lista baseada no slug da URL
  const nicheData = niches.find((n) => n.slug === params.slug);
  const displayTitle = nicheData ? nicheData.title : params.slug;

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

      {/* Passamos o nicho da URL para o motor já vir preenchido */}
      <CopyTool defaultNiche={displayTitle} />

      <div className="max-w-2xl mt-12 text-center text-slate-400 text-xs">
         SEO Otimizado: /legenda-para-{params.slug}
      </div>
    </div>
  );
}
