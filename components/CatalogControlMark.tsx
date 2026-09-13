export function CatalogControlMark() {
  return (
    <span className="catalog-control-mark" data-motif="curated-catalog" aria-hidden="true">
      <svg viewBox="0 0 156 82" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="catalog-control-glass" x1="24" y1="8" x2="133" y2="76" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity=".8" />
            <stop offset=".45" stopColor="#c8f7ff" stopOpacity=".48" />
            <stop offset="1" stopColor="#dc9aff" stopOpacity=".68" />
          </linearGradient>
        </defs>
        <g className="catalog-control-card catalog-control-card--one"><rect x="15" y="23" width="42" height="49" rx="9" /><path d="M24 38h21M24 47h15M24 56h18" /></g>
        <g className="catalog-control-card catalog-control-card--two"><rect x="42" y="10" width="42" height="49" rx="9" /><path d="M51 25h21M51 34h15M51 43h18" /></g>
        <g className="catalog-control-card catalog-control-card--three"><rect x="70" y="19" width="42" height="49" rx="9" /><path d="M79 34h21M79 43h15M79 52h18" /></g>
        <g className="catalog-control-card catalog-control-card--four"><rect x="98" y="7" width="42" height="49" rx="9" fill="url(#catalog-control-glass)" /><path d="M107 22h21M107 31h15M107 40h18" /></g>
        <path className="catalog-control-spark" d="M123 47c1.5 7.6 5.4 11.5 13 13-7.6 1.5-11.5 5.4-13 13-1.5-7.6-5.4-11.5-13-13 7.6-1.5 11.5-5.4 13-13Z" />
      </svg>
    </span>
  );
}
