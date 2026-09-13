interface PageMotifIconProps {
  kind: 'catalog' | 'writing' | 'about' | 'privacy' | 'time';
}

export function PageMotifIcon({ kind }: PageMotifIconProps) {
  if (kind === 'catalog') {
    return (
      <span className="page-motif page-motif--catalog" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="50" cy="50" r="25" />
          <path d="m68 68 20 20" />
          <path d="M27 34 18 24m56 7 12-9M25 70l-13 7m78-25 15 3" />
          <circle cx="18" cy="24" r="3" /><circle cx="86" cy="22" r="3" />
          <circle cx="12" cy="77" r="3" /><circle cx="105" cy="55" r="3" />
          <path className="motif-accent" d="m48 38 3.5 7.5L59 49l-7.5 3.5L48 60l-3.5-7.5L37 49l7.5-3.5Z" />
        </svg>
      </span>
    );
  }

  if (kind === 'writing') {
    return (
      <span className="page-motif page-motif--writing" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path d="M25 29c14-5 25-2 35 6v58c-10-8-21-11-35-6Z" />
          <path d="M95 29c-14-5-25-2-35 6v58c10-8 21-11 35-6Z" />
          <path d="M36 46c7-1 12 1 16 4M36 58c7-1 12 1 16 4M68 48c5-3 10-4 16-3" />
          <path className="motif-accent" d="M72 70 91 51l7 7-19 19-10 3Z" />
        </svg>
      </span>
    );
  }

  if (kind === 'privacy') {
    return (
      <span className="page-motif page-motif--privacy" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path d="M60 16 94 29v25c0 23-13 40-34 50-21-10-34-27-34-50V29Z" />
          <rect x="43" y="50" width="34" height="27" rx="7" />
          <path d="M49 50v-7c0-7 5-12 11-12s11 5 11 12v7" />
          <circle className="motif-accent" cx="60" cy="62" r="4" />
          <path d="M60 66v5" />
        </svg>
      </span>
    );
  }

  if (kind === 'time') {
    return (
      <span className="page-motif page-motif--time" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="39" />
          <path d="M60 34v28l19 12" />
          <path d="M60 14v8M60 98v8M14 60h8M98 60h8" />
          <path className="motif-accent" d="M91 20c1.1 6 4.2 9.1 10.2 10.2-6 1.1-9.1 4.2-10.2 10.2-1.1-6-4.2-9.1-10.2-10.2 6-1.1 9.1-4.2 10.2-10.2Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="page-motif page-motif--about" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="42" />
        <ellipse cx="60" cy="60" rx="48" ry="19" transform="rotate(-24 60 60)" />
        <circle cx="60" cy="48" r="12" />
        <path d="M38 84c4-14 12-21 22-21s18 7 22 21" />
        <circle className="motif-accent" cx="101" cy="41" r="5" />
      </svg>
    </span>
  );
}
