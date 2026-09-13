interface PageMotifIconProps {
  kind: 'catalog' | 'writing' | 'about' | 'privacy' | 'time';
}

export function PageMotifIcon({ kind }: PageMotifIconProps) {
  if (kind === 'catalog') {
    return (
      <span className="page-motif page-motif--catalog" data-motif="catalog-lens" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path className="motif-glass" d="M19 30h56a9 9 0 0 1 9 9v42a9 9 0 0 1-9 9H19a9 9 0 0 1-9-9V39a9 9 0 0 1 9-9Z" />
          <path d="M18 43h47M18 54h31M18 65h23" opacity=".48" />
          <circle cx="72" cy="65" r="21" />
          <path className="motif-highlight" d="M58 57a16 16 0 0 1 22-7" />
          <path d="m87 80 17 17" strokeWidth="4" />
          <path className="motif-accent" d="M93 22c1.2 6 4.3 9.1 10.3 10.3-6 1.2-9.1 4.3-10.3 10.3-1.2-6-4.3-9.1-10.3-10.3 6-1.2 9.1-4.3 10.3-10.3Z" />
          <circle className="motif-node" cx="18" cy="82" r="3.5" />
        </svg>
      </span>
    );
  }

  if (kind === 'writing') {
    return (
      <span className="page-motif page-motif--writing" data-motif="illuminated-folio" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path className="motif-glass" d="M18 29c15-5 28-2 42 8v58c-13-9-27-12-42-7V29Z" />
          <path className="motif-glass" d="M102 29c-15-5-28-2-42 8v58c13-9 27-12 42-7V29Z" />
          <path d="M60 37v58M29 48c8-1 14 .5 20 4M29 60c8-1 14 .5 20 4M70 48c6-3 12-4 20-2M70 59c5-2 10-3 15-2" opacity=".58" />
          <path className="motif-accent" d="m81 69 19-19 8 8-19 19-12 4Z" />
          <path className="motif-highlight" d="m101 53-19 19" />
          <path className="motif-spark" d="M24 17c1 5 3.6 7.6 8.6 8.6-5 .9-7.6 3.5-8.6 8.5-1-5-3.6-7.6-8.6-8.5 5-.9 7.6-3.6 8.6-8.6Z" />
        </svg>
      </span>
    );
  }

  if (kind === 'privacy') {
    return (
      <span className="page-motif page-motif--privacy" data-motif="privacy-seal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path className="motif-glass" d="M60 12 101 28v30c0 26-16 45-41 56-25-11-41-30-41-56V28Z" />
          <path className="motif-highlight" d="M60 22 91 34v23c0 19-10 34-31 45" />
          <rect x="39" y="50" width="42" height="33" rx="9" />
          <path d="M47 50v-8c0-9 6-15 13-15s13 6 13 15v8" />
          <path className="motif-accent" d="M60 59a6 6 0 0 1 3.5 10.9V76h-7v-6.1A6 6 0 0 1 60 59Z" />
          <circle className="motif-node" cx="26" cy="36" r="3" />
          <circle className="motif-node" cx="94" cy="36" r="3" />
        </svg>
      </span>
    );
  }

  if (kind === 'time') {
    return (
      <span className="page-motif page-motif--time" data-motif="time-crystal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path className="motif-glass" d="m60 10 36 14 14 36-14 36-36 14-36-14-14-36 14-36Z" />
          <circle cx="60" cy="60" r="34" />
          <path className="motif-highlight" d="M38 38a31 31 0 0 1 36-7" />
          <path d="M60 35v27l19 12" strokeWidth="4" />
          <path d="M60 18v7M60 95v7M18 60h7M95 60h7" opacity=".62" />
          <path className="motif-accent" d="M91 20c1.1 6 4.2 9.1 10.2 10.2-6 1.1-9.1 4.2-10.2 10.2-1.1-6-4.2-9.1-10.2-10.2 6-1.1 9.1-4.2 10.2-10.2Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="page-motif page-motif--about" data-motif="project-intersection" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <path className="motif-glass" d="M15 19h34a7 7 0 0 1 7 7v22a7 7 0 0 1-7 7H31l-10 8v-8h-6a7 7 0 0 1-7-7V26a7 7 0 0 1 7-7Z" />
        <path d="M19 31h25M19 40h18" opacity=".58" />
        <path className="motif-glass" d="M76 14h29a7 7 0 0 1 7 7v28a7 7 0 0 1-7 7H76a7 7 0 0 1-7-7V21a7 7 0 0 1 7-7Z" />
        <path d="m81 24 18 12-9 2-4 9Z" />
        <rect className="motif-glass" x="30" y="76" width="60" height="36" rx="10" />
        <path d="m49 86-7 8 7 8M71 86l7 8-7 8M64 83l-8 22" />
        <path className="motif-connector" d="m45 49 10 9M76 51l-11 8M60 70v7" />
        <path className="motif-accent" d="M60 48c1.3 6.2 4.6 9.5 10.8 10.8-6.2 1.3-9.5 4.6-10.8 10.8-1.3-6.2-4.6-9.5-10.8-10.8 6.2-1.3 9.5-4.6 10.8-10.8Z" />
      </svg>
    </span>
  );
}
