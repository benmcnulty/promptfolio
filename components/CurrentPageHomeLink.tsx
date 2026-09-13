'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

export function CurrentPageHomeLink({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const pathname = usePathname();
  const returnHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return <Link href="/" className={className} onClick={returnHome}>{children}</Link>;
}
