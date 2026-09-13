// component/CustomListings.tsx
import React from "react";
import { Persona } from "@/components/Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";

interface CustomListingsProps {
  gptNames: string[];
  headline: string;
  backgroundClass: string;
}

export function CustomListings({
  gptNames,
  headline,
  backgroundClass,
}: CustomListingsProps) {
  const customCatalog: CatalogItem[] = gptNames
    .map((name) => catalog.find((item) => item.name === name))
    .filter((item): item is CatalogItem => item !== undefined);
  const title = headline || 'Continue exploring Promptfolio';
  const titleId = `gpt-feature-${gptNames.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const tone = backgroundClass.includes('green')
    ? 'sage'
    : backgroundClass.includes('blue')
      ? 'blue'
      : 'lilac';

  return (
    <section
      className={`article-gpt-feature article-gpt-feature--${tone}`}
      aria-labelledby={titleId}
    >
      <div className="article-gpt-heading">
        <p className="eyebrow">From the catalog</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <div className="article-gpt-grid" data-count={customCatalog.length}>
        {customCatalog.map((persona) => (
          <Persona key={persona.name} personaData={persona} headingLevel={3} />
        ))}
      </div>
    </section>
  );
}
