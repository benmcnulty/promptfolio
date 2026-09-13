import type { MetadataRoute } from 'next';
import { siteDescription } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Promptfolio by Ben McNulty',
    short_name: 'Promptfolio',
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9fc',
    theme_color: '#7840bd',
    categories: ['portfolio', 'technology', 'productivity'],
    icons: [
      { src: '/promptfolio-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/promptfolio-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/promptfolio-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/promptfolio-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
