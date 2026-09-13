export function HomeSectionIcon({ kind }: { kind: 'agent' | 'compass' | 'archive' }) {
  if (kind === 'archive') {
    return (
      <span className="section-icon section-icon--archive" data-motif="editorial-folio" aria-hidden="true">
        <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="folio-glass" x1="12" y1="12" x2="52" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity=".78" />
              <stop offset=".48" stopColor="#bff6ff" stopOpacity=".34" />
              <stop offset="1" stopColor="#d995ff" stopOpacity=".56" />
            </linearGradient>
            <linearGradient id="folio-ink" x1="24" y1="46" x2="50" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8feeff" /><stop offset=".55" stopColor="#d99aff" /><stop offset="1" stopColor="#ffe58e" />
            </linearGradient>
          </defs>
          <path className="section-icon-glass" d="M10.5 16.5c7.7-2.4 14.2-.9 21.5 4.7v31.1c-7.1-5.2-13.8-6.8-21.5-4.4V16.5Z" fill="url(#folio-glass)" />
          <path className="section-icon-glass" d="M53.5 16.5c-7.7-2.4-14.2-.9-21.5 4.7v31.1c7.1-5.2 13.8-6.8 21.5-4.4V16.5Z" fill="url(#folio-glass)" />
          <path d="M32 21.2v31.1M15 24.5c4.8-.7 8.7.2 12.6 2.7M15 31.2c4.8-.7 8.7.2 12.6 2.7" />
          <path className="section-icon-accent" d="m46.5 13.5 5 5-14.8 14.8-6.2 1.2 1.2-6.2 14.8-14.8Z" fill="url(#folio-ink)" />
          <path className="section-icon-highlight" d="m48.1 15.1-14.7 14.7" />
          <path className="section-icon-spark" d="M14 10c.8 3.1 2.1 4.4 5.2 5.2-3.1.8-4.4 2.1-5.2 5.2-.8-3.1-2.1-4.4-5.2-5.2 3.1-.8 4.4-2.1 5.2-5.2Z" />
        </svg>
      </span>
    );
  }

  if (kind === 'agent') {
    return (
      <span className="section-icon section-icon--agent" aria-hidden="true">
        <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 11.5h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" />
          <path d="M16 11.5V7.75M13.5 6h5M7 16H4.75M27.25 16H25" />
          <circle cx="12.5" cy="17" r="1.25" />
          <circle cx="19.5" cy="17" r="1.25" />
          <path d="M12.5 21h7" />
        </svg>
      </span>
    );
  }

  return (
    <span className="section-icon section-icon--compass" data-motif="intent-signpost" aria-hidden="true">
      <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="signpost-glass" x1="10" y1="50" x2="55" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8deeff" stopOpacity=".58" /><stop offset=".48" stopColor="#d697ff" stopOpacity=".82" /><stop offset="1" stopColor="#ffe68e" stopOpacity=".66" />
          </linearGradient>
          <linearGradient id="signpost-edge" x1="19" y1="14" x2="47" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" /><stop offset=".52" stopColor="#c8f7ff" /><stop offset="1" stopColor="#f4bdff" />
          </linearGradient>
        </defs>
        <path className="section-icon-glass" d="M29 16.5h19l7 6-7 6H29v-12Z" fill="url(#signpost-glass)" />
        <path className="section-icon-glass" d="M35 29H16l-7 6 7 6h19V29Z" fill="url(#signpost-glass)" />
        <path className="section-icon-glass" d="M29 41.5h16l6 5.5-6 5.5H29v-11Z" fill="url(#signpost-glass)" />
        <path d="M32 13v43M25 57h14" stroke="url(#signpost-edge)" strokeWidth="3" />
        <path className="section-icon-highlight" d="M33 19h14M31 32H17M33 44.5h11" />
        <path className="section-icon-spark" d="M18 10c.8 3.1 2.1 4.4 5.2 5.2-3.1.8-4.4 2.1-5.2 5.2-.8-3.1-2.1-4.4-5.2-5.2 3.1-.8 4.4-2.1 5.2-5.2Z" />
      </svg>
    </span>
  );
}
