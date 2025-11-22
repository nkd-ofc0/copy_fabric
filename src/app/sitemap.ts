import { MetadataRoute } from 'next';
import { niches } from '@/lib/niches';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://copy-factory.vercel.app'; // TROQUE PELO SEU LINK REAL DA VERCEL

  // Página principal
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // Páginas de nicho automáticas
  const nicheRoutes = niches.map((niche) => ({
    url: `${baseUrl}/legenda-para-${niche.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...nicheRoutes];
}
