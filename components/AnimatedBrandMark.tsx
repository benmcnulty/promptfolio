'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

type AnimatedBrandMarkProps = {
  className: 'brand-mark' | 'footer-mark';
  size: number;
  priority?: boolean;
};

const movingLayers = ['brand-mark-float', 'brand-mark-satellite-orbit'];

export function AnimatedBrandMark({ className, size, priority = false }: AnimatedBrandMarkProps) {
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    const lockup = mark?.closest('.brand, .footer-lockup');
    if (!mark || !lockup) return;

    const reset = () => {
      mark.dataset.settling = 'false';
      mark.querySelectorAll('.brand-motion-finished').forEach((layer) => layer.classList.remove('brand-motion-finished'));
    };
    const settle = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      mark.dataset.settling = 'true';
    };

    lockup.addEventListener('pointerenter', reset);
    lockup.addEventListener('pointerleave', settle);
    return () => {
      lockup.removeEventListener('pointerenter', reset);
      lockup.removeEventListener('pointerleave', settle);
    };
  }, []);

  const finishLayer = (event: React.AnimationEvent<HTMLSpanElement>) => {
    const mark = markRef.current;
    if (!mark || mark.dataset.settling !== 'true' || !movingLayers.includes(event.animationName)) return;

    (event.target as HTMLElement).classList.add('brand-motion-finished');
    if (mark.querySelectorAll('.brand-motion-finished').length < movingLayers.length) return;

    window.requestAnimationFrame(() => {
      mark.dataset.settling = 'false';
      mark.querySelectorAll('.brand-motion-finished').forEach((layer) => layer.classList.remove('brand-motion-finished'));
    });
  };

  return (
    <span ref={markRef} className={className} aria-hidden="true" data-settling="false" onAnimationIteration={finishLayer}>
      <span className="brand-mark-orbit brand-mark-orbit--outer" />
      <span className="brand-mark-orbit brand-mark-orbit--inner" />
      <span className="brand-mark-satellite"><span className="brand-mark-satellite-dot" /></span>
      <Image src="/promptfolio-mark.svg" alt="" width={size} height={size} priority={priority} />
    </span>
  );
}
