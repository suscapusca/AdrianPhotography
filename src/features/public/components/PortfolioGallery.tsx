import { startTransition, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Category, PortfolioItem } from '@/shared/lib/content-schema';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

type PortfolioGalleryProps = {
  items: PortfolioItem[];
  categories: Category[];
  activeCategory: string;
  countsByCategory?: Record<string, number>;
  totalCount?: number;
  onCategoryChange: (category: string) => void;
  onOpen: (index: number) => void;
};

export function PortfolioGallery({
  items,
  categories,
  activeCategory,
  countsByCategory = {},
  totalCount = items.length,
  onCategoryChange,
  onOpen,
}: PortfolioGalleryProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node || prefersReducedMotion) {
      return;
    }

    const cards = node.querySelectorAll('.portfolio-card');
    const context = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.06, ease: 'power3.out' },
      );
    }, node);

    return () => context.revert();
  }, [items, prefersReducedMotion]);

  return (
    <div className="portfolio-gallery" ref={rootRef}>
      <div className="filter-bar" data-reveal>
        <button
          type="button"
          className={activeCategory === 'all' ? 'is-active' : ''}
          onClick={() => startTransition(() => onCategoryChange('all'))}
        >
          <span>All Work</span>
          <strong>{totalCount}</strong>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={activeCategory === category.slug ? 'is-active' : ''}
            onClick={() => startTransition(() => onCategoryChange(category.slug))}
          >
            <span>{category.name}</span>
            <strong>{countsByCategory[category.slug] ?? 0}</strong>
          </button>
        ))}
      </div>

      <div className="portfolio-masonry">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`portfolio-card portfolio-card--${item.aspectRatio} ${item.featured ? 'portfolio-card--featured' : ''}`}
          >
            <button type="button" className="portfolio-card__button" onClick={() => onOpen(index)}>
              <div className="portfolio-card__media">
                {item.mediaType === 'video' ? (
                  <video src={item.src} poster={item.posterSrc} muted loop playsInline preload="metadata" />
                ) : (
                  <img src={item.thumbnailSrc} alt={item.alt} loading="lazy" />
                )}
                <div className="portfolio-card__shade" />
              </div>
              <div className="portfolio-card__body">
                <div>
                  <p className="eyebrow">{item.categorySlug}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="portfolio-card__meta">
                  <span>{item.location}</span>
                  <span>{item.year}</span>
                  <span>{item.mediaType === 'video' ? 'Motion' : 'Photo'}</span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
