import catalog from '@/lib/catalog';
import { filterCatalog, parseCatalogFilters } from '@/utils/filterCatalog';
import { CatalogResults } from './CatalogResults';
import { LabelToggle } from './LabelToggle';
import { PageMotifIcon } from './PageMotifIcon';

interface ListingProps { filter?: string | string[]; search?: string | string[]; }

export function Listing({ filter, search }: ListingProps) {
  const filters = parseCatalogFilters(filter);
  const query = (Array.isArray(search) ? search.at(0) ?? '' : search ?? '').trim();
  const items = filterCatalog(catalog, filters, query);
  return (
    <section className="page-section catalog-page" aria-labelledby="catalog-title">
      <div className="page-heading page-heading--catalog">
        <div className="page-heading-copy">
          <p className="eyebrow">39 purpose-built assistants</p>
          <h1 id="catalog-title">Custom GPT catalog</h1>
          <p>Browse experiments for focused work, thoughtful conversation, and visual creativity.</p>
        </div>
        <PageMotifIcon kind="catalog" />
      </div>
      <LabelToggle selectedLabels={filters} search={query} />
      {items.length > 0 ? (
        <CatalogResults items={items} />
      ) : (
        <div className="empty-state">
          <h2>No GPTs match those choices</h2>
          <p>Try another phrase or clear the filters to see the complete catalog.</p>
          <a className="text-link" href="/listing">Clear search and filters</a>
        </div>
      )}
    </section>
  );
}
