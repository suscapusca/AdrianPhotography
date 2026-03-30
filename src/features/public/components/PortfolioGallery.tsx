import { startTransition, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Category, PortfolioItem } from '@/shared/lib/content-schema';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

type PortfolioGalleryProps = {
  items: PortfolioItem[];
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onOpen: (index: number) => void;
};

export function PortfolioGallery({
  items,
  categories,
  activeCategory,
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
          All Work
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={activeCategory === category.slug ? 'is-active' : ''}
            onClick={() => startTransition(() => onCategoryChange(category.slug))}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="portfolio-masonry">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`portfolio-card portfolio-card--${item.aspectRatio}`}
          >
            <button type="button" className="portfolio-card__button" onClick={() => onOpen(index)}>
              <div className="portfolio-card__media">
                {item.mediaType === 'video' ? (
                  <video src={item.src} poster={item.posterSrc} muted loop playsInline />
                ) : (
                  <img src={item.thumbnailSrc} alt={item.alt} loading="lazy" />
                )}
              </div>
              <div className="portfolio-card__body">
                <div>
                  <p className="eyebrow">{item.categorySlug}</p>
                  <h3>{item.title}</h3>
                </div>
                <span>{item.location}</span>
              </div>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
