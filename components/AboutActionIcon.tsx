interface AboutActionIconProps {
  kind: 'catalog' | 'site' | 'github';
}

export function AboutActionIcon({ kind }: AboutActionIconProps) {
  if (kind === 'catalog') {
    return <svg aria-hidden="true" viewBox="0 0 32 32"><rect x="5" y="6" width="9" height="9" rx="2"/><rect x="18" y="6" width="9" height="9" rx="2"/><rect x="5" y="19" width="9" height="7" rx="2"/><path d="M18 22.5h9M22.5 18v9"/></svg>;
  }
  if (kind === 'site') {
    return <svg aria-hidden="true" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c4 4 5.5 7.5 5.5 11S20 23 16 27c-4-4-5.5-7.5-5.5-11S12 9 16 5Z"/></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 4.5A11.5 11.5 0 0 0 12.4 27c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.4c0 .3.2.7.8.6A11.5 11.5 0 0 0 16 4.5Z"/></svg>;
}
