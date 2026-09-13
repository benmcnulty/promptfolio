export function ExternalLinkIcon({ className }: { className?: string }) {
  const classes = ['external-link-icon', className].filter(Boolean).join(' ');

  return (
    <svg
      aria-hidden="true"
      className={classes}
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 14 14 6" />
      <path d="M8 6h6v6" />
    </svg>
  );
}
