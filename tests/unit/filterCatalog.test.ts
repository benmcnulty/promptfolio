import catalog from '@/lib/catalog';
import filterCatalog, { catalogLabels, parseCatalogFilters } from '@/utils/filterCatalog';

describe('catalog query behavior', () => {
  it('normalizes, deduplicates, and rejects unsupported filters', () => {
    expect(parseCatalogFilters(' WORK,work,unknown, art ')).toEqual(['work', 'art']);
    expect(parseCatalogFilters(['featured,chat', 'art'])).toEqual(['featured', 'chat', 'art']);
    expect(parseCatalogFilters()).toEqual([]);
  });

  it('preserves OR semantics for every label combination', () => {
    for (let mask = 0; mask < 2 ** catalogLabels.length; mask += 1) {
      const filters = catalogLabels.filter((_, index) => Boolean(mask & (1 << index)));
      const result = filterCatalog(catalog, filters);
      const expected = filters.length === 0
        ? catalog
        : catalog.filter((item) => filters.some((label) => item.labels.includes(label)));
      expect(result.map(({ name }) => name)).toEqual(expected.map(({ name }) => name));
    }
  });

  it('searches names, descriptions, and tags case-insensitively', () => {
    expect(filterCatalog(catalog, [], '  CONCEPT artist ')[0]?.name).toBe('Concept Artist');
    expect(filterCatalog(catalog, [], 'photography').map(({ name }) => name)).toContain('Robot Photographer');
    expect(filterCatalog(catalog, ['work'], 'nonexistent phrase')).toEqual([]);
  });

  it('combines search with recognized labels and ignores invalid labels', () => {
    const result = filterCatalog(catalog, ['work', 'not-real'], 'concept');
    expect(result.map(({ name }) => name)).toEqual(['Concept Artist']);
  });
});
