import { Metadata } from 'next';
import { niches } from '@/lib/niches';
import Home from '../../page'; // Importando a Home voltando 2 pastas

// GERA AS PÁGINAS ESTÁTICAS
export async function generateStaticParams() {
  return niches.map((niche) => ({
    slug: niche.slug,
  }));
}

// GERA O TÍTULO PARA O GOOGLE
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const nicheData = niches.find((n) => n.slug === params.slug);
  const title = nicheData ? nicheData.title : 'Negócios';

  return {
    title: `Gerador de Legenda para ${title} - IA Grátis`,
    description: `Crie posts para ${title} em segundos.`,
  };
}

// A PÁGINA
export default function NichePage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-blue-50 p-2 text-center text-blue-800 text-sm font-bold uppercase tracking-wider mb-4">
        Ferramenta: {params.slug.replace('-', ' ')}
      </div>
      
      {/* Aqui chamamos sua ferramenta original */}
      <Home />
      
      <div className="max-w-2xl px-4 py-8 text-center text-slate-400 text-xs">
        <p>SEO Otimizado para: {params.slug}</p>
      </div>
    </div>
  );
}
