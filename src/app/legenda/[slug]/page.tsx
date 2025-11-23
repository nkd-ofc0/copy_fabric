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

      <div className="mt-20 mb-10 text-center space-y-4">
         <div className="h-px w-16 bg-slate-200 mx-auto"></div>
         
         <div className="flex flex-col items-center gap-1">
           <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
             Criado e Desenvolvido por
           </p>
           <a 
             href="https://www.instagram.com/nkd.ofc/" 
             target="_blank" 
             className="text-blue-600 font-black text-sm hover:underline flex items-center gap-1"
           >
             NKD <span className="text-slate-300 font-normal">| Tecnologia & Growth</span>
           </a>
         </div>
         
         <p className="text-[10px] text-slate-300">
           SEO Otimizado: /legenda/{resolvedParams.slug}
         </p>
      </div>
    </div>
  );
}
