// component/FocusListing.tsx
import React from "react";
import Link from "next/link";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";

interface FocusListingProps {
  gptName: string;
  subheading: string;
  additionalContent: string;
  backgroundClass: string;
  greeting: string;
}

export function FocusListing({
  gptName,
  subheading,
  additionalContent,
  backgroundClass,
  greeting,
}: FocusListingProps) {
  const personaData: CatalogItem | undefined = catalog.find(
    (item) => item.name === gptName
  );

  if (!personaData) {
    return (
      <div className="text-center my-10">
        <h3 className="text-3xl font-semibold mb-4">Enjoy our Custom GPTs!</h3>
        <Link href="/listing" className="text-link text-lg">
          See full listing
        </Link>
      </div>
    );
  }

  const tone = backgroundClass.includes('green')
    ? 'sage'
    : backgroundClass.includes('blue')
      ? 'blue'
      : 'lilac';
  const titleId = `gpt-focus-${personaData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section
      className={`article-gpt-feature article-gpt-feature--${tone} article-gpt-focus`}
      aria-labelledby={titleId}
    >
      <div className="article-gpt-heading">
        <p className="eyebrow">From the catalog</p>
        <h2 id={titleId}>
          {greeting} {personaData.name}
        </h2>
        <p className="article-gpt-subheading">{subheading}</p>
        <p>{additionalContent}</p>
      </div>
      <div className="article-gpt-grid" data-count="1">
        <Persona personaData={personaData} headingLevel={3} />
      </div>
    </section>
  );
}
