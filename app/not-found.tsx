import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
      <section className="error-page" aria-labelledby="not-found-title">
        <div className="error-copy">
          <p className="eyebrow">404 · Lost in the archive</p>
          <h1 id="not-found-title">Page not found</h1>
          <p>
            This route may have moved, or the address may be incomplete. The collection and writing archive are still close by.
          </p>
          <div className="error-actions">
            <Link className="text-link error-home-link" href="/">Return home</Link>
            <Link className="text-link" href="/listing">Browse the catalog <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="error-motif" aria-hidden="true">
          <span>404</span>
          <svg viewBox="0 0 180 180">
            <path d="M39 43c16-8 31-8 47 1v92c-16-9-31-9-47-1Z" />
            <path d="M141 43c-16-8-31-8-47 1v92c16-9 31-9 47-1Z" />
            <path d="M86 44c3 2 5 2 8 0v92c-3 2-5 2-8 0Z" opacity=".45" />
            <path className="error-route" d="M55 111c6-24 24-18 30-35s22-22 40-9" />
            <circle className="error-route-point" cx="55" cy="111" r="4" />
            <path className="error-spark" d="M128 52c1.5 8 5.5 12 13.5 13.5-8 1.5-12 5.5-13.5 13.5-1.5-8-5.5-12-13.5-13.5 8-1.5 12-5.5 13.5-13.5Z" />
            <path className="error-spark" d="M48 38c.7 3.8 2.7 5.8 6.5 6.5-3.8.7-5.8 2.7-6.5 6.5-.7-3.8-2.7-5.8-6.5-6.5 3.8-.7 5.8-2.7 6.5-6.5Z" />
          </svg>
        </div>
      </section>
  );
}
