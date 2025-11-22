import { Metadata } from 'next';
import { niches } from '@/lib/niches';
import Home from '../page'; // Reaproveitamos a sua página inicial (o componente da ferramenta)

// 1. ISSO AQUI GERA AS PÁGINAS ESTÁTICAS NO BUILD (Super Rápido pro Google)
export async function generateStaticParams() {
  return niches.map((niche) => ({
    slug: niche.slug,
  }));
}

// 2. ISSO AQUI CRIA O TÍTULO E DESCRIÇÃO PRO GOOGLE (SEO)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const nicheData = niches.find((n) => n.slug === slug);
  const title = nicheData ? nicheData.title : 'Negócios Locais';

  return {
    title: `Gerador de Legenda para ${title} com IA - Grátis`,
    description: `Crie legendas de Instagram perfeitas para ${title} em segundos. Ferramenta de IA gratuita para engajar seguidores e vender mais.`,
    keywords: [`legenda para ${slug}`, `post para ${slug}`, "gerador de legenda", "ia instagram"],
  };
}

// 3. A PÁGINA EM SI
export default function NichePage({ params }: { params: { slug: string } }) {
  // Aqui você poderia customizar a página ainda mais.
  // Por enquanto, vamos renderizar a Home, mas podemos injetar o nicho padrão no futuro.
  // Para simplificar e reaproveitar seu código atual, renderizamos a Home.
  
  // DICA DE OURO: No futuro, modifique sua Home para aceitar uma prop "defaultNiche"
  // e passe ela aqui: <Home defaultNiche={params.slug} />
  
  return (
    <div className="flex flex-col items-center">
      {/* Um texto oculto ou pequeno focado em SEO antes da ferramenta */}
      <div className="max-w-2xl text-center mt-4 px-4">
         <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
           Ferramenta Especializada: {params.slug.replace('-', ' ')}
         </p>
      </div>
      
      {/* Renderiza a sua ferramenta inteira */}
      <Home />
      
      {/* Texto de SEO no rodapé (O Google ama isso, o usuário nem liga) */}
      <div className="max-w-3xl px-4 py-10 text-slate-500 text-sm leading-relaxed">
        <h2 className="font-bold text-slate-700 mb-2">Como criar posts para {params.slug}?</h2>
        <p>
          Se você trabalha com <strong>{params.slug}</strong>, sabe como é difícil ter ideias criativas todos os dias. 
          Nossa IA foi treinada especificamente para criar textos persuasivos (Copywriting) para o seu nicho.
          Chega de bloqueio criativo. Use o CopyFactory para gerar engajamento real no seu perfil.
        </p>
      </div>
    </div>
  );
}