'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';
import { AnimatedBrandMark } from './AnimatedBrandMark';
import { CurrentPageHomeLink } from './CurrentPageHomeLink';
import { ModeToggle } from './ui/mode-toggle';

export function Header() {
  const pathname = usePathname();
  const keepCurrentPage = (event: MouseEvent<HTMLAnchorElement>, isCurrent: boolean) => {
    if (!isCurrent) return;
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const catalogCurrent = pathname === '/listing';
  const writingActive = pathname.startsWith('/blog');
  const writingCurrent = pathname === '/blog';
  const aboutCurrent = pathname === '/about';

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <CurrentPageHomeLink className="brand">
          <AnimatedBrandMark className="brand-mark" size={40} priority />
          <span className="brand-type"><strong>Promptfolio</strong><small><span>by</span> Ben McNulty</small></span><span className="sr-only"> home</span>
        </CurrentPageHomeLink>
        <div className="header-actions">
          <nav aria-label="Primary navigation" className="primary-nav">
            <Link href="/listing" aria-current={catalogCurrent ? 'page' : undefined} onClick={(event) => keepCurrentPage(event, catalogCurrent)}>Catalog</Link>
            <Link href="/blog" aria-current={writingActive ? 'page' : undefined} onClick={(event) => keepCurrentPage(event, writingCurrent)}>Writing</Link>
            <Link href="/about" aria-current={aboutCurrent ? 'page' : undefined} onClick={(event) => keepCurrentPage(event, aboutCurrent)}>About</Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
