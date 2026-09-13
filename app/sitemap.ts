import { MetadataRoute } from 'next'
import { blog } from '@/lib/blog'
import { siteUpdatedAt, siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/listing`,
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic blog pages
  const blogPages = blog.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
