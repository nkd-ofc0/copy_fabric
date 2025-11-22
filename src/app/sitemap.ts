import { MetadataRoute } from 'next';
import { niches } from '@/lib/niches'; // Pega aquela lista que criamos lá atrás

export default function sitemap(): MetadataRoute.Sitemap {
  // ATENÇÃO: Troque pelo seu link real da Vercel quando souber
  const baseUrl = 'https://copy-fabric.vercel.app'; 

  // 1. Página Principal
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // 2. Páginas de Nicho (Aqui estava o erro, agora corrigido para /legenda/)
  const nicheRoutes = niches.map((niche) => ({
    url: `${baseUrl}/legenda/${niche.slug}`, // <--- MUDOU AQUI
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...nicheRoutes];
}
