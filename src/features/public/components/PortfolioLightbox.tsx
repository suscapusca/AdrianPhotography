import { useEffect } from 'react';
import type { PortfolioItem } from '@/shared/lib/content-schema';

type PortfolioLightboxProps = {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

export function PortfolioLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: PortfolioLightboxProps) {
  const item = items[index];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowRight') {
        onNavigate((index + 1) % items.length);
      }

      if (event.key === 'ArrowLeft') {
        onNavigate((index - 1 + items.length) % items.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [index, items.length, onClose, onNavigate]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" className="lightbox__backdrop" onClick={onClose} aria-label="Close viewer" />
      <div className="lightbox__panel">
        <button type="button" className="lightbox__close" onClick={onClose}>
          Close
        </button>

        <div className="lightbox__media">
          {item.mediaType === 'video' ? (
            <video src={item.src} poster={item.posterSrc} controls autoPlay playsInline />
          ) : (
            <img src={item.src} alt={item.alt} />
          )}
        </div>

        <div className="lightbox__meta">
          <div>
            <p className="eyebrow">{item.categorySlug}</p>
            <h3>{item.title}</h3>
            <p>{item.longDescription}</p>
          </div>
          <div className="lightbox__meta-grid">
            <span>{item.location}</span>
            <span>{item.year}</span>
            <span>{item.mediaType}</span>
          </div>
        </div>

        <div className="lightbox__actions">
          <button type="button" className="button button--ghost" onClick={() => onNavigate((index - 1 + items.length) % items.length)}>
            Previous
          </button>
          <button type="button" className="button button--primary" onClick={() => onNavigate((index + 1) % items.length)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
