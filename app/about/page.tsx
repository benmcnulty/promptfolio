// app/about/page.tsx
import { About } from "@/components/About";
import { Metadata } from "next";
import { StructuredData } from '@/components/StructuredData';
import { personSchema, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Ben McNulty built Promptfolio as a tested, accessible portfolio of Custom GPT experiments and writing.",
  alternates: { canonical: '/about' },
  keywords: ["Ben McNulty", "AI prompt engineer", "GPT specialist", "artificial intelligence", "custom GPTs"],
  openGraph: {
    title: "About Promptfolio | Ben McNulty",
    description: "How Ben McNulty built Promptfolio as a tested, accessible portfolio of Custom GPT experiments and writing.",
    type: "website",
    url: "https://www.promptfolio.dev/about",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Promptfolio by Ben McNulty' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Promptfolio | Ben McNulty",
    description: "How Ben McNulty built Promptfolio as a tested, accessible portfolio of Custom GPT experiments and writing.",
    images: ['/twitter-image'],
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/about#profile`,
    url: `${siteUrl}/about`,
    name: 'About Promptfolio and Ben McNulty',
    mainEntity: personSchema,
  };
  return <><StructuredData data={jsonLd} /><About /></>;
}
