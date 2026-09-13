// app/blog/page.tsx
import { BlogContents } from "@/components/BlogContents";
import { Metadata } from "next";
import { StructuredData } from '@/components/StructuredData';
import { blog } from '@/lib/blog';
import { personSchema, siteUrl } from '@/lib/site';
export const metadata: Metadata = {
  title: "Writing Archive",
  description: "Case studies and historical essays documenting the design, engineering, and creative practice behind Promptfolio.",
  alternates: { canonical: '/blog' },
  keywords: ["AI blog", "prompt engineering", "GPT development", "artificial intelligence articles", "machine learning"],
  openGraph: {
    title: "Writing Archive | Promptfolio by Ben McNulty",
    description: "Case studies and historical essays documenting the design and engineering behind Promptfolio.",
    type: "website",
    url: "https://www.promptfolio.dev/blog",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Promptfolio by Ben McNulty' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing Archive | Promptfolio by Ben McNulty",
    description: "Case studies and historical essays documenting the design and engineering behind Promptfolio.",
    images: ['/twitter-image'],
  },
};

export default function BlogPage() {
  const posts = [...blog].sort((a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteUrl}/blog#archive`,
    url: `${siteUrl}/blog`,
    name: 'Promptfolio writing archive',
    description: metadata.description,
    author: { '@id': personSchema['@id'] },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishDate,
      url: `${siteUrl}/blog/${post.slug}`,
      image: `${siteUrl}${post.imageUrl}`,
      author: { '@id': personSchema['@id'] },
    })),
  };
  return <><StructuredData data={jsonLd} /><BlogContents /></>;
}
