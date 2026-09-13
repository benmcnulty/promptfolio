import { StructuredData } from './StructuredData';
import { personSchema, siteUrl } from '@/lib/site';

interface ArticleSummary {
  slug: string;
  title: string;
  publishDate: string;
  description: string;
  imageUrl: string;
}

export function ArticleStructuredData({ post }: { post?: ArticleSummary }) {
  if (!post) return null;

  return (
    <StructuredData data={{
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${siteUrl}/blog/${post.slug}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      image: `${siteUrl}${post.imageUrl}`,
      url: `${siteUrl}/blog/${post.slug}`,
      inLanguage: 'en-US',
      author: personSchema,
      isPartOf: { '@id': `${siteUrl}/blog#archive` },
    }} />
  );
}
