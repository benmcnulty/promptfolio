import CatalogItem from '@/lib/types';

export const catalogLabels = ['featured', 'work', 'chat', 'art'] as const;
export type CatalogLabel = (typeof catalogLabels)[number];

export function parseCatalogFilters(value?: string | string[]): CatalogLabel[] {
  const raw = Array.isArray(value) ? value.join(',') : value ?? '';
  return [...new Set(raw.split(',').map((label) => label.trim().toLowerCase()))]
    .filter((label): label is CatalogLabel => catalogLabels.includes(label as CatalogLabel));
}

export function filterCatalog(
  items: CatalogItem[],
  filters: readonly string[] = [],
  search = '',
): CatalogItem[] {
  const selected = parseCatalogFilters(filters.join(','));
  const query = search.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const matchesLabel = selected.length === 0
      || selected.some((label) => item.labels.includes(label));
    const searchable = [item.name, item.description, ...item.tags].join(' ').toLocaleLowerCase();
    return matchesLabel && (query === '' || searchable.includes(query));
  });
}

export default filterCatalog;
