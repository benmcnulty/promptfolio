import Image from 'next/image';
import Link from 'next/link';
import CatalogItem from '@/lib/types';
import { CatalogLabelIcon } from './CatalogLabelIcon';
import { ExternalLinkIcon } from './ExternalLinkIcon';

export function Persona({
  personaData,
  headingLevel = 2,
  preload = false,
}: {
  personaData: CatalogItem;
  headingLevel?: 2 | 3;
  preload?: boolean;
}) {
  const title = headingLevel === 3
    ? <h3 className="persona-title">{personaData.name}</h3>
    : <h2 className="persona-title">{personaData.name}</h2>;
  const tone = personaData.labels.includes('art')
    ? 'lilac'
    : personaData.labels.includes('chat')
      ? 'sage'
      : 'blue';

  return (
    <article className="persona-card" data-tone={tone}>
      <div className="persona-image">
        <Image
          alt={personaData.alt.trim()}
          src={personaData.image}
          unoptimized={personaData.image.endsWith('.webp')}
          fill
          preload={preload}
          quality={80}
          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 800px) calc(50vw - 1.6rem), (max-width: 1200px) calc(33vw - 1.5rem), 368px"
        />
        <div className="persona-title-banner">{title}</div>
      </div>
      <div className="persona-body">
        <div className="persona-labels" aria-label="Categories">
          {personaData.labels.map((label) => (
            <span key={label} className={`persona-label persona-label--${label}`}>
              <CatalogLabelIcon label={label} />
              {label}
            </span>
          ))}
        </div>
        <p>{personaData.description}</p>
        <Link className="card-link" href={personaData.link} rel="noopener noreferrer" target="_blank">
          <span>Chat with {personaData.name}</span>
          <ExternalLinkIcon />
        </Link>
      </div>
    </article>
  );
}
