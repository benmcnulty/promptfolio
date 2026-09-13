'use client';

import { useEffect, useRef } from 'react';

export function HomeSectionIcon({ kind }: { kind: 'agent' | 'compass' | 'archive' }) {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    const heading = icon?.closest('.section-heading--with-icon');
    if (!icon || !heading) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      icon.dataset.visible = 'true';
      return;
    }
    const section = heading.closest('section');
    const sectionBounds = section?.getBoundingClientRect();
    const fullyVisibleOnLoad = Boolean(
      sectionBounds
      && sectionBounds.top >= 0
      && sectionBounds.bottom <= window.innerHeight,
    );
    let ready = false;
    let latestEntry: IntersectionObserverEntry | undefined;
    const applyVisibility = () => {
      if (!ready) return;
      icon.dataset.visible = latestEntry?.isIntersecting ? 'true' : 'false';
    };
    const observer = new IntersectionObserver(([entry]) => {
      latestEntry = entry;
      applyVisibility();
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    observer.observe(heading);
    const revealTimer = fullyVisibleOnLoad
      ? window.setTimeout(() => {
        ready = true;
        applyVisibility();
      }, kind === 'agent' ? 900 : kind === 'compass' ? 1050 : 1200)
      : 0;
    const armOnScroll = () => {
      ready = true;
      applyVisibility();
      window.removeEventListener('scroll', armOnScroll);
    };
    if (!fullyVisibleOnLoad) window.addEventListener('scroll', armOnScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(revealTimer);
      window.removeEventListener('scroll', armOnScroll);
    };
  }, [kind]);

  if (kind === 'archive') {
    return (
      <span ref={iconRef} className="section-icon section-icon--archive" data-motif="editorial-folio" data-visible="false" aria-hidden="true">
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
          <path className="section-icon-glass section-icon-focal" d="M10.5 16.5c7.7-2.4 14.2-.9 21.5 4.7v31.1c-7.1-5.2-13.8-6.8-21.5-4.4V16.5Z" fill="url(#folio-glass)" />
          <path className="section-icon-glass section-icon-focal" d="M53.5 16.5c-7.7-2.4-14.2-.9-21.5 4.7v31.1c7.1-5.2 13.8-6.8 21.5-4.4V16.5Z" fill="url(#folio-glass)" />
          <path d="M32 21.2v31.1M15 24.5c4.8-.7 8.7.2 12.6 2.7M15 31.2c4.8-.7 8.7.2 12.6 2.7" />
          <path d="M36.5 39c4.7-2.2 8.5-2.7 12.2-1.7M36.5 44.7c4.2-1.8 7.6-2.2 10.7-1.3" opacity=".5" />
          <path className="section-icon-accent" d="m46.5 13.5 5 5-14.8 14.8-6.2 1.2 1.2-6.2 14.8-14.8Z" fill="url(#folio-ink)" />
          <path className="section-icon-highlight" d="m48.1 15.1-14.7 14.7" />
          <path className="section-icon-spark" d="M14 10c.8 3.1 2.1 4.4 5.2 5.2-3.1.8-4.4 2.1-5.2 5.2-.8-3.1-2.1-4.4-5.2-5.2 3.1-.8 4.4-2.1 5.2-5.2Z" />
          <path className="section-icon-spark" d="M52 40c.5 2 1.4 2.9 3.4 3.4-2 .5-2.9 1.4-3.4 3.4-.5-2-1.4-2.9-3.4-3.4 2-.5 2.9-1.4 3.4-3.4Z" opacity=".62" />
        </svg>
      </span>
    );
  }

  if (kind === 'agent') {
    return (
      <span ref={iconRef} className="section-icon section-icon--agent" data-visible="false" aria-hidden="true">
        <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path className="section-icon-glass section-icon-focal" d="M18 22h28a7 7 0 0 1 7 7v17a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7V29a7 7 0 0 1 7-7Z" fill="currentColor" fillOpacity=".1" />
          <path d="M32 22V13M26 10h12M11 34H6M58 34h-5" />
          <circle className="section-icon-spark" cx="32" cy="9" r="2.2" />
          <circle className="section-icon-node" cx="24" cy="35" r="3" />
          <circle className="section-icon-node" cx="40" cy="35" r="3" />
          <path className="section-icon-highlight" d="M23 44c5.6 4.3 12.4 4.3 18 0" />
          <path d="M16 29h32M18 53v4M46 53v4M8 30v8M56 30v8" opacity=".5" />
          <path className="section-icon-accent" d="M18 18c4-3.5 8.7-5.2 14-5.2S42 14.5 46 18M16 57h32" />
        </svg>
      </span>
    );
  }

  return (
    <span ref={iconRef} className="section-icon section-icon--compass" data-motif="intent-signpost" data-visible="false" aria-hidden="true">
      <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="signpost-glass" x1="10" y1="50" x2="55" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8deeff" stopOpacity=".58" /><stop offset=".48" stopColor="#d697ff" stopOpacity=".82" /><stop offset="1" stopColor="#ffe68e" stopOpacity=".66" />
          </linearGradient>
          <linearGradient id="signpost-edge" x1="19" y1="14" x2="47" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" /><stop offset=".52" stopColor="#c8f7ff" /><stop offset="1" stopColor="#f4bdff" />
          </linearGradient>
        </defs>
        <path className="section-icon-glass section-icon-focal" d="M29 16.5h19l7 6-7 6H29v-12Z" fill="url(#signpost-glass)" />
        <path className="section-icon-glass section-icon-focal" d="M35 29H16l-7 6 7 6h19V29Z" fill="url(#signpost-glass)" />
        <path className="section-icon-glass section-icon-focal" d="M29 41.5h16l6 5.5-6 5.5H29v-11Z" fill="url(#signpost-glass)" />
        <path d="M32 13v43M25 57h14" stroke="url(#signpost-edge)" strokeWidth="3" />
        <path className="section-icon-highlight" d="M33 19h14M31 32H17M33 44.5h11" />
        <path className="section-icon-spark" d="M18 10c.8 3.1 2.1 4.4 5.2 5.2-3.1.8-4.4 2.1-5.2 5.2-.8-3.1-2.1-4.4-5.2-5.2 3.1-.8 4.4-2.1 5.2-5.2Z" />
        <circle className="section-icon-node" cx="32" cy="13" r="1.8" />
        <circle className="section-icon-node" cx="32" cy="56" r="1.8" />
        <path className="section-icon-spark" d="M51 35c.55 2.2 1.5 3.15 3.7 3.7-2.2.55-3.15 1.5-3.7 3.7-.55-2.2-1.5-3.15-3.7-3.7 2.2-.55 3.15-1.5 3.7-3.7Z" opacity=".58" />
      </svg>
    </span>
  );
}
