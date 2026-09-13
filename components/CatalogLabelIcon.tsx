export function CatalogLabelIcon({ label }: { label: string }) {
  if (label === 'featured') {
    return <svg className="catalog-label-icon catalog-label-icon--featured" data-label-icon="featured" aria-hidden="true" viewBox="0 0 24 24"><path className="catalog-label-icon-orbit" d="M3.5 14.8c1.65 4.15 6.3 6.8 10.7 5.8 2.7-.6 5.05-2.3 6.4-4.65"/><path className="catalog-label-icon-accent" d="m12 2.8 2.35 6.05 6.45.35-5.02 4.08 1.65 6.27L12 16.05l-5.43 3.5 1.65-6.27L3.2 9.2l6.45-.35L12 2.8Z"/><path className="catalog-label-icon-highlight" d="m7.35 10.45 3.55-.2 1.3-3.3"/></svg>;
  }
  if (label === 'work') {
    return <svg className="catalog-label-icon catalog-label-icon--work" data-label-icon="work" aria-hidden="true" viewBox="0 0 24 24"><rect className="catalog-label-icon-glass" x="3" y="7.1" width="18" height="12.7" rx="3.1"/><path className="catalog-label-icon-line" d="M8.2 7.1V5.9c0-1 .8-1.8 1.8-1.8h4c1 0 1.8.8 1.8 1.8v1.2M3.4 11.2c3.2 1.65 6 2.35 8.6 2.35s5.4-.7 8.6-2.35M7.2 19.8v-5.25M16.8 19.8v-5.25"/><rect className="catalog-label-icon-accent catalog-label-icon-clasp" x="10.05" y="11.75" width="3.9" height="3.2" rx=".8"/><path className="catalog-label-icon-highlight" d="M5.35 9.2h6.15"/></svg>;
  }
  if (label === 'chat') {
    return <svg className="catalog-label-icon catalog-label-icon--chat" data-label-icon="chat" aria-hidden="true" viewBox="0 0 24 24"><path className="catalog-label-icon-glass catalog-label-icon-bubble-back" d="M8.7 4.3h8.4A3.9 3.9 0 0 1 21 8.2v4a3.9 3.9 0 0 1-3.9 3.9h-1.5l-3 3v-3H8.7a3.9 3.9 0 0 1-3.9-3.9v-4a3.9 3.9 0 0 1 3.9-3.9Z"/><path className="catalog-label-icon-accent catalog-label-icon-bubble-front" d="M4.9 7.5h7.2a3.3 3.3 0 0 1 3.3 3.3v2.6a3.3 3.3 0 0 1-3.3 3.3H9.6l-2.8 2.5v-2.5H4.9a3.3 3.3 0 0 1-3.3-3.3v-2.6a3.3 3.3 0 0 1 3.3-3.3Z"/><path className="catalog-label-icon-line" d="M5.3 11.1h6.4M5.3 13.3h4.3"/><path className="catalog-label-icon-highlight" d="M9 5.9h5.1"/><path className="catalog-label-icon-spark" d="M18.35 3.25c.28 1.3 1.05 2.07 2.35 2.35-1.3.28-2.07 1.05-2.35 2.35-.28-1.3-1.05-2.07-2.35-2.35 1.3-.28 2.07-1.05 2.35-2.35Z"/></svg>;
  }
  if (label === 'art') {
    return <svg className="catalog-label-icon catalog-label-icon--art" data-label-icon="art" aria-hidden="true" viewBox="0 0 24 24"><rect className="catalog-label-icon-glass" x="3.2" y="5.1" width="15.7" height="15.7" rx="3.2"/><path className="catalog-label-icon-line" d="M7 16.9 8.1 12l8.65-8.65a1.65 1.65 0 0 1 2.35 0l1.55 1.55a1.65 1.65 0 0 1 0 2.35L12 15.9 7 16.9Z"/><path className="catalog-label-icon-accent catalog-label-icon-brush" d="m15.35 4.75 3.9 3.9-7.25 7.2-4.95 1.05 1.1-4.9Z"/><path className="catalog-label-icon-highlight" d="m16.2 5.6 2.2 2.2"/><path className="catalog-label-icon-spark" d="M5 2.7c.25 1.15.95 1.85 2.1 2.1C5.95 5.05 5.25 5.75 5 6.9c-.25-1.15-.95-1.85-2.1-2.1C4.05 4.55 4.75 3.85 5 2.7Z"/></svg>;
  }
  return null;
}
