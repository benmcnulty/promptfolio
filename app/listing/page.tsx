// app/listing/page.tsx
import { Listing } from "@/components/Listing";
import { Metadata } from "next";
import catalog from '@/lib/catalog';
import { StructuredData } from '@/components/StructuredData';
import { personSchema, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: "Custom GPTs",
  description: "Explore 39 Custom GPT experiments for focused work, thoughtful conversation, and visual creativity by Ben McNulty.",
  alternates: { canonical: '/listing' },
  keywords: ["custom GPTs", "AI agents", "specialized AI", "work automation", "creative AI", "chat AI"],
  openGraph: {
    title: "Custom GPT Catalog | Promptfolio by Ben McNulty",
    description: "Explore 39 Custom GPT experiments for work, conversation, and art.",
    type: "website",
    url: "https://www.promptfolio.dev/listing",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Promptfolio by Ben McNulty' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom GPT Catalog | Promptfolio by Ben McNulty",
    description: "Explore 39 Custom GPT experiments for work, conversation, and art.",
    images: ['/twitter-image'],
  },
};

export default async function ListingPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filter, search } = await searchParams;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/listing#collection`,
    url: `${siteUrl}/listing`,
    name: 'Custom GPT catalog',
    description: metadata.description,
    author: { '@id': personSchema['@id'] },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: catalog.length,
      itemListElement: catalog.map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name, url: item.link,
      })),
    },
  };
  return <><StructuredData data={jsonLd} /><Listing filter={filter} search={search} /></>;
}
