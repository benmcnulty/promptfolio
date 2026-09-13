'use client';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useCallback, useRef, useState, useSyncExternalStore, ViewTransition } from 'react';
import CatalogItem from '@/lib/types';
import { CatalogLabelIcon } from './CatalogLabelIcon';
import { ExternalLinkIcon } from './ExternalLinkIcon';

type CatalogView = 'list' | 'grid';
type CatalogResult = Pick<CatalogItem, 'name' | 'description' | 'link' | 'image' | 'alt' | 'labels'>;

function ViewIcon({ view }: { view: CatalogView }) {
  return view === 'list' ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <rect x="3" y="4.5" width="3" height="3" rx=".7" />
      <rect x="3" y="10.5" width="3" height="3" rx=".7" />
      <rect x="3" y="16.5" width="3" height="3" rx=".7" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.3" />
      <rect x="14" y="3" width="7" height="7" rx="1.3" />
      <rect x="3" y="14" width="7" height="7" rx="1.3" />
      <rect x="14" y="14" width="7" height="7" rx="1.3" />
    </svg>
  );
}

function ExpandIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5" /></svg>;
}

export function CatalogResults({ items }: { items: CatalogResult[] }) {
  const detectedViewRef = useRef<CatalogView | null>(null);
  const readInitialView = useCallback(() => {
    detectedViewRef.current ??= window.matchMedia('(max-width: 767px)').matches ? 'list' : 'grid';
    return detectedViewRef.current;
  }, []);
  const detectedView = useSyncExternalStore(
    useCallback(() => () => undefined, []),
    readInitialView,
    () => null,
  );
  const [chosenView, setChosenView] = useState<CatalogView | null>(null);
  const view = chosenView ?? detectedView;
  const detailsAreCollapsed = view === 'list';
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const chooseView = (nextView: CatalogView) => {
    startTransition(() => setChosenView(nextView));
  };
  const toggleExpanded = (name: string) => {
    // The card already animates its own geometry. Keeping this update outside a
    // document View Transition prevents a second image snapshot from stretching
    // over the live thumbnail while the rail expands.
    setExpandedName((current) => current === name ? null : name);
  };
  const imageSizes = view === 'list'
    ? '72px'
    : view === 'grid'
      ? '(max-width: 639px) calc(100vw - 2rem), (max-width: 800px) calc(50vw - 1.6rem), (max-width: 1200px) calc(33vw - 1.5rem), 368px'
      : '(max-width: 767px) 72px, (max-width: 800px) calc(50vw - 1.6rem), (max-width: 1200px) calc(33vw - 1.5rem), 368px';

  return (
    <div className="catalog-results" data-view={view ?? 'auto'}>
      <div className="catalog-result-bar">
        <div>
          <p className="result-count" aria-live="polite"><strong>{items.length}</strong> {items.length === 1 ? 'GPT' : 'GPTs'} found</p>
          <p>Categories combine to broaden results.</p>
        </div>
        <div className="catalog-view-switch" role="group" aria-label="Catalog view">
          {(['list', 'grid'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`catalog-view-button catalog-view-button--${option}`}
              aria-pressed={view === option}
              onClick={() => chooseView(option)}
            >
              <ViewIcon view={option} />
              <span>{option === 'list' ? 'List' : 'Grid'}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-entries">
        {items.map((persona, index) => {
          const isExpanded = expandedName === persona.name;
          const detailsId = `catalog-details-${index}`;
          const transitionSlug = persona.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
          const tone = persona.labels.includes('art') ? 'lilac' : persona.labels.includes('chat') ? 'sage' : 'blue';
          return (
            <ViewTransition
              key={persona.name}
              name={`catalog-${transitionSlug}`}
              enter="catalog-item-enter"
              exit="catalog-item-exit"
              update="catalog-item-update"
            >
            <article
              className="catalog-entry"
              data-expanded={isExpanded}
              data-tone={tone}
            >
              <div className="catalog-entry-summary">
                <ViewTransition name={`catalog-image-${transitionSlug}`} update="catalog-image-update">
                  <div className="catalog-entry-image">
                    <Image
                      alt={persona.alt.trim()}
                      src={persona.image}
                      unoptimized={persona.image.endsWith('.webp')}
                      fill
                      preload={index === 0}
                      quality={80}
                      sizes={view === 'list' && isExpanded ? '104px' : imageSizes}
                    />
                  </div>
                </ViewTransition>
                <div className="catalog-entry-heading">
                  <h2>{persona.name}</h2>
                  <div className="catalog-entry-compact-labels" aria-label="Categories">
                    {persona.labels.map((label) => (
                      <span key={label} className={`catalog-compact-label catalog-compact-label--${label}`}>
                        <CatalogLabelIcon label={label} />
                        <span className="catalog-compact-label-text">{label}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="catalog-entry-expand"
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${persona.name}`}
                  onClick={() => toggleExpanded(persona.name)}
                >
                  <ExpandIcon />
                </button>
              </div>
              <div
                className="catalog-entry-reveal"
                aria-hidden={detailsAreCollapsed && !isExpanded}
                inert={detailsAreCollapsed && !isExpanded ? true : undefined}
              >
                <div className="catalog-entry-reveal-inner">
                  <div className="catalog-entry-details" id={detailsId}>
                    <div className="catalog-entry-grid-labels" aria-label="Categories">
                      {persona.labels.map((label) => (
                        <span key={label} className={`catalog-compact-label catalog-compact-label--${label}`}>
                          <CatalogLabelIcon label={label} />
                          <span className="catalog-compact-label-text">{label}</span>
                        </span>
                      ))}
                    </div>
                    <p>{persona.description}</p>
                    <Link className="card-link" href={persona.link} rel="noopener noreferrer" target="_blank">
                      <span>Chat with {persona.name}</span>
                      <ExternalLinkIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
            </ViewTransition>
          );
        })}
      </div>
    </div>
  );
}
