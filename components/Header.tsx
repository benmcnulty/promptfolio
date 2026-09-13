'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBrandMark } from './AnimatedBrandMark';
import { ModeToggle } from './ui/mode-toggle';

export function Header() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCompact(window.scrollY > 20);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('pageshow', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('pageshow', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header className="site-header" data-compact={compact ? 'true' : 'false'}>
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <AnimatedBrandMark className="brand-mark" size={40} priority />
          <span><strong>Promptfolio</strong><small><span>by</span> Ben McNulty</small></span><span className="sr-only"> home</span>
        </Link>
        <div className="header-actions">
          <nav aria-label="Primary navigation" className="primary-nav">
            <Link href="/listing">Catalog</Link><Link href="/blog">Writing</Link><Link href="/about">About</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
