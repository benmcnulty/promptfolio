type AboutCardMarkKind = 'collection' | 'foundation' | 'maker';

export function AboutCardMark({ kind }: { kind: AboutCardMarkKind }) {
  const gradientId = `about-card-${kind}`;

  return (
    <span className={`about-card-mark about-card-mark--${kind}`} data-motif={kind} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="18" y1="18" x2="102" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity=".9" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".24" />
          </linearGradient>
        </defs>

        {kind === 'collection' && (
          <>
            <rect x="19" y="22" width="34" height="34" rx="8" />
            <rect x="67" y="22" width="34" height="34" rx="8" />
            <rect x="19" y="70" width="34" height="28" rx="8" />
            <path d="M76 84h18M85 75v18" />
            <path className="about-card-mark-accent" d="M56 52c1.4 7.4 5.2 11.2 12.6 12.6C61.2 66 57.4 69.8 56 77.2 54.6 69.8 50.8 66 43.4 64.6 50.8 63.2 54.6 59.4 56 52Z" fill={`url(#${gradientId})`} />
          </>
        )}

        {kind === 'foundation' && (
          <>
            <path d="m38 31-18 29 18 29M82 31l18 29-18 29" />
            <path d="M49 41h22M45 60h30M49 79h22" />
            <circle className="about-card-mark-accent" cx="49" cy="41" r="4" fill={`url(#${gradientId})`} />
            <circle className="about-card-mark-accent" cx="75" cy="60" r="4" fill={`url(#${gradientId})`} />
            <circle className="about-card-mark-accent" cx="49" cy="79" r="4" fill={`url(#${gradientId})`} />
          </>
        )}

        {kind === 'maker' && (
          <>
            <circle cx="58" cy="40" r="15" />
            <path d="M25 99c2.5-22.5 14.4-34 33-34s30.5 11.5 33 34" />
            <path d="M40 70c4.5 7.2 10.5 10.8 18 10.8S71.5 77.2 76 70" />
            <path className="about-card-mark-accent" d="M91 18c1.2 6.2 4.4 9.4 10.6 10.6C95.4 29.8 92.2 33 91 39.2 89.8 33 86.6 29.8 80.4 28.6 86.6 27.4 89.8 24.2 91 18Z" fill={`url(#${gradientId})`} />
            <path className="about-card-mark-accent" d="M24 42c.7 3.8 2.7 5.8 6.5 6.5-3.8.7-5.8 2.7-6.5 6.5-.7-3.8-2.7-5.8-6.5-6.5 3.8-.7 5.8-2.7 6.5-6.5Z" fill={`url(#${gradientId})`} />
          </>
        )}
      </svg>
    </span>
  );
}
