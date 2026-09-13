import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/api/' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/api/' },
      { userAgent: 'GPTBot', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
