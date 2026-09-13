'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useOptimistic, useRef, useTransition, type FormEvent, type MouseEvent } from 'react';
import { CatalogLabel, catalogLabels } from '@/utils/filterCatalog';
import { CatalogLabelIcon } from './CatalogLabelIcon';
import { CatalogControlMark } from './CatalogControlMark';

interface LabelToggleProps { selectedLabels: CatalogLabel[]; search: string; }

export function LabelToggle({ selectedLabels, search }: LabelToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const preservedScrollRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeLabels, setActiveLabels] = useOptimistic(selectedLabels);
  const canClear = activeLabels.length > 0 || Boolean(search);
  const unrelatedParams = Array.from(searchParams.entries()).filter(
    ([name]) => name !== 'filter' && name !== 'search',
  );
  const clearParams = new URLSearchParams(unrelatedParams);
  const clearHref = `${pathname}${clearParams.size ? `?${clearParams}` : ''}`;
  const replaceCatalogUrl = (params: URLSearchParams) => {
    preservedScrollRef.current = window.scrollY;
    router.replace(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false });
  };
  useLayoutEffect(() => {
    if (preservedScrollRef.current === null) return;
    const top = preservedScrollRef.current;
    preservedScrollRef.current = null;
    window.scrollTo({ top, behavior: 'instant' });
  }, [selectedLabels, search]);
  const toggleLabel = (label: CatalogLabel) => {
    const next = activeLabels.includes(label)
      ? activeLabels.filter((item) => item !== label)
      : [...activeLabels, label];
    const params = new URLSearchParams(window.location.search);
    if (next.length) params.set('filter', next.join(',')); else params.delete('filter');
    startTransition(() => {
      setActiveLabels(next);
      replaceCatalogUrl(params);
    });
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const query = new FormData(event.currentTarget).get('search')?.toString().trim() ?? '';
    if (query) params.set('search', query); else params.delete('search');
    startTransition(() => replaceCatalogUrl(params));
  };
  const clearAll = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (searchInputRef.current) searchInputRef.current.value = '';
    startTransition(() => {
      setActiveLabels([]);
      replaceCatalogUrl(clearParams);
    });
  };
  return (
    <div className="catalog-controls" aria-busy={isPending}>
      <div className="catalog-control-heading">
        <div><p className="control-kicker">Search the collection</p><h2>Find your next collaborator</h2></div>
        <CatalogControlMark />
      </div>
      <form action="/listing" method="get" role="search" className="search-form" onSubmit={submitSearch}>
        <label htmlFor="catalog-search">Search GPTs</label>
        <div className="search-field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input ref={searchInputRef} id="catalog-search" name="search" type="search" defaultValue={search} placeholder="Name, purpose, or topic" /></div>
        {activeLabels.length > 0 && <input type="hidden" name="filter" value={activeLabels.join(',')} />}
        {unrelatedParams.map(([name, value], index) => (
          <input key={`${name}-${value}-${index}`} type="hidden" name={name} value={value} />
        ))}
        <button type="submit" className="button-primary">Search</button>
      </form>
      <div className="filter-toolbar">
        <div className="filter-heading"><span>Browse by category</span><span className="filter-clear-slot"><a className="filter-clear" data-visible={canClear} aria-hidden={!canClear} tabIndex={canClear ? undefined : -1} href={clearHref} onClick={clearAll}>Clear all</a></span></div>
        <div className="filter-row" aria-label="Filter catalog">
          {catalogLabels.map((label) => (
            <button key={label} type="button" aria-pressed={activeLabels.includes(label)} className="filter-button" onClick={() => toggleLabel(label)}>
              <CatalogLabelIcon label={label} />
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
