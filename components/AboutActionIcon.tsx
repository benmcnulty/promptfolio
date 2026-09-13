interface AboutActionIconProps {
  kind: 'catalog' | 'site' | 'github';
}

export function AboutActionIcon({ kind }: AboutActionIconProps) {
  if (kind === 'catalog') {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <path className="about-action-icon-orbit" d="M8 29C5 18 13 7 25 7c10 0 18 6 20 15" />
        <rect className="about-action-icon-glass about-action-icon-pane--back" x="9" y="11" width="15" height="14" rx="4" />
        <rect className="about-action-icon-glass" x="20" y="18" width="18" height="17" rx="5" />
        <path className="about-action-icon-detail" d="M25 24h8M25 29h5" />
        <path className="about-action-icon-accent" d="M11 32c.7 3.4 2.5 5.2 5.9 5.9-3.4.7-5.2 2.5-5.9 5.9-.7-3.4-2.5-5.2-5.9-5.9 3.4-.7 5.2-2.5 5.9-5.9Z" />
        <circle className="about-action-icon-node" cx="40" cy="12" r="2" />
      </svg>
    );
  }
  if (kind === 'site') {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <circle className="about-action-icon-glass" cx="24" cy="24" r="15" />
        <path className="about-action-icon-detail" d="M9 24h30M24 9c5.5 5 7.5 10 7.5 15S29.5 34 24 39c-5.5-5-7.5-10-7.5-15S18.5 14 24 9Z" />
        <ellipse className="about-action-icon-orbit" cx="24" cy="24" rx="21" ry="9" transform="rotate(-24 24 24)" />
        <circle className="about-action-icon-node" cx="42" cy="16" r="2.2" />
        <path className="about-action-icon-accent" d="M11 7c.5 2.6 1.9 4 4.5 4.5-2.6.5-4 1.9-4.5 4.5-.5-2.6-1.9-4-4.5-4.5 2.6-.5 4-1.9 4.5-4.5Z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48">
      <path className="about-action-icon-orbit" d="M6 29C5 17 14 7 26 7c8 0 15 4 19 11" />
      <path className="about-action-github-mark" d="M24 10.5A13.5 13.5 0 0 0 19.8 37c.7.1.9-.3.9-.7v-2.6c-4 .9-4.8-1.6-4.8-1.6-.6-1.6-1.5-2.1-1.5-2.1-1.3-.8.1-.8.1-.8 1.4.1 2.1 1.4 2.1 1.4 1.3 2.1 3.3 1.5 4.1 1.1.1-.9.5-1.5.9-1.9-3.2-.4-6.5-1.5-6.5-6.8 0-1.5.6-2.7 1.4-3.7-.1-.4-.6-1.9.1-3.7 0 0 1.2-.4 3.8 1.4a13 13 0 0 1 6.8 0c2.6-1.8 3.8-1.4 3.8-1.4.7 1.8.2 3.3.1 3.7.9 1 1.4 2.2 1.4 3.7 0 5.3-3.3 6.4-6.5 6.8.5.5.9 1.3.9 2.6v4c0 .4.2.8.9.7A13.5 13.5 0 0 0 24 10.5Z" />
      <path className="about-action-icon-highlight" d="M16 14c3-2.1 7.2-2.8 11-1.8" />
      <circle className="about-action-icon-node" cx="42" cy="18" r="2.2" />
      <path className="about-action-icon-accent" d="M9 33c.6 3 2.2 4.6 5.2 5.2-3 .6-4.6 2.2-5.2 5.2-.6-3-2.2-4.6-5.2-5.2 3-.6 4.6-2.2 5.2-5.2Z" />
    </svg>
  );
}

export function AboutActionArrow({ external = false }: { external?: boolean }) {
  return (
    <span className={`about-action-arrow${external ? ' about-action-arrow--external' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 42 28">
        <path className="about-action-arrow-trace" d={external ? 'M7 22 27 7' : 'M4 14h27'} />
        <path className="about-action-arrow-main" d={external ? 'M19 6h10v10' : 'm25 7 7 7-7 7'} />
        <circle className="about-action-arrow-glint" cx={external ? '11' : '8'} cy={external ? '19' : '14'} r="2" />
      </svg>
    </span>
  );
}
