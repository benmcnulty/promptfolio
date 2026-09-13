type HeroActionMarkKind = 'catalog' | 'process';

export function HeroActionMark({ kind }: { kind: HeroActionMarkKind }) {
  const gradientId = `hero-action-${kind}-edge`;
  const glowId = `hero-action-${kind}-glow`;

  return (
    <span className={`hero-action-mark hero-action-mark--${kind}`} data-action-motif={kind} aria-hidden="true">
      <svg viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="13" y1="12" x2="104" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity=".32" />
            <stop offset=".52" stopColor="currentColor" stopOpacity=".92" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".2" />
          </linearGradient>
          <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {kind === 'catalog' ? (
          <>
            <g className="hero-action-mark-layer hero-action-mark-layer--back">
              <rect x="38" y="11" width="61" height="48" rx="9" />
              <path d="M49 25h28M49 34h38M49 43h21" />
            </g>
            <g className="hero-action-mark-layer hero-action-mark-layer--front">
              <rect x="18" y="29" width="66" height="49" rx="10" />
              <rect x="29" y="41" width="12" height="12" rx="3" />
              <rect x="48" y="41" width="12" height="12" rx="3" />
              <rect x="29" y="59" width="12" height="9" rx="3" />
              <path d="M48 63.5h17M56.5 55v17" />
            </g>
            <path className="hero-action-mark-trace" d="M26 71C49 79 77 70 83 47c4-16 12-24 27-27" stroke={`url(#${gradientId})`} filter={`url(#${glowId})`} />
            <path className="hero-action-mark-spark" d="M101 12c1 5.1 3.6 7.7 8.7 8.7-5.1 1-7.7 3.6-8.7 8.7-1-5.1-3.6-7.7-8.7-8.7 5.1-1 7.7-3.6 8.7-8.7Z" />
          </>
        ) : (
          <>
            <g className="hero-action-mark-layer hero-action-mark-layer--back">
              <path d="M28 19h53l14 14v37H28V19Z" />
              <path d="M81 19v14h14" />
            </g>
            <g className="hero-action-mark-layer hero-action-mark-layer--front">
              <path d="M18 31h53l14 14v32H18V31Z" />
              <path d="M71 31v14h14" />
            </g>
            <path className="hero-action-mark-route" d="M29 62c8-17 18-17 27-7 8 9 16 7 21-4" />
            <circle className="hero-action-mark-node hero-action-mark-node--one" cx="29" cy="62" r="3.2" />
            <circle className="hero-action-mark-node hero-action-mark-node--two" cx="77" cy="51" r="3.2" />
            <path className="hero-action-mark-trace" d="M29 62c8-17 18-17 27-7 8 9 16 7 21-4" stroke={`url(#${gradientId})`} filter={`url(#${glowId})`} />
            <path className="hero-action-mark-spark" d="M99 53c.8 4.2 3 6.4 7.2 7.2-4.2.8-6.4 3-7.2 7.2-.8-4.2-3-6.4-7.2-7.2 4.2-.8 6.4-3 7.2-7.2Z" />
          </>
        )}
      </svg>
    </span>
  );
}
