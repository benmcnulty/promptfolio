'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties } from 'react';

interface FullScreenImageProps { src: string; alt: string; width: number; height: number; caption?: string; credit?: string; }

export default function FullScreenImage({ src, alt, width, height, caption, credit = 'Created with DALL·E by Ben McNulty' }: FullScreenImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => dialogRef.current?.close();
  const open = () => dialogRef.current?.showModal();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => { document.body.classList.remove('dialog-open'); triggerRef.current?.focus(); };
    const onOpen = () => document.body.classList.add('dialog-open');
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('cancel', onClose);
    const observer = new MutationObserver(() => { if (dialog.open) onOpen(); });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    return () => { observer.disconnect(); dialog.removeEventListener('close', onClose); dialog.removeEventListener('cancel', onClose); document.body.classList.remove('dialog-open'); };
  }, []);

  return (
    <figure className="article-figure">
      <button ref={triggerRef} type="button" className="image-trigger" onClick={open} aria-label={`Expand image: ${alt}`}>
        <Image src={src} alt={alt} width={width} height={height} quality={88} sizes="(max-width: 768px) calc(100vw - 2rem), 768px" />
        <span className="image-trigger-control" aria-hidden="true">
          <svg viewBox="0 0 20 20"><path d="M7.5 3.5h-4v4M12.5 3.5h4v4M7.5 16.5h-4v-4M12.5 16.5h4v-4" /></svg>
        </span>
      </button>
      {(caption || credit) && <figcaption>{caption && <span>{caption}</span>}<small>{credit}</small></figcaption>}
      <dialog ref={dialogRef} className="image-dialog" aria-label={`Enlarged image: ${alt}`} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <button type="button" className="dialog-close" onClick={close} aria-label="Close enlarged image">
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5 5 15" /></svg>
        </button>
        <div className="dialog-image-frame" style={{ '--image-ratio': width / height } as CSSProperties}>
          <Image className="dialog-image" src={src} alt={alt} fill quality={88} sizes="94vw" />
        </div>
        {(caption || credit) && <div className="dialog-caption">{caption && <span>{caption}</span>}<small>{credit}</small></div>}
      </dialog>
    </figure>
  );
}
