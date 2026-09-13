'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import FullScreenImage from './FullScreenImage';

interface ImageData { src: string; alt: string; caption?: string; credit?: string; }

export default function ImageCarousel({ images }: { images: ImageData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: true, right: false });
  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({ left: track.scrollLeft <= 1, right: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 });
  }, []);
  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    updateEdges();
    return () => observer.disconnect();
  }, [updateEdges]);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  };
  return (
    <section className="carousel" aria-label={`Image gallery with ${images.length} items`}>
      <button type="button" onClick={() => move(-1)} disabled={edges.left} aria-label="Previous image">←</button>
      <div ref={trackRef} className="carousel-track" tabIndex={0} onScroll={updateEdges} onKeyDown={onKeyDown}>
        {images.map((image) => <div className="carousel-item" key={image.src}><FullScreenImage src={image.src} alt={image.alt} width={500} height={500} caption={image.caption} credit={image.credit} /></div>)}
      </div>
      <button type="button" onClick={() => move(1)} disabled={edges.right} aria-label="Next image">→</button>
    </section>
  );
}
