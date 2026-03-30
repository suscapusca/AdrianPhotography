import { Link } from 'react-router-dom';
import type { PortfolioItem } from '@/shared/lib/content-schema';

type FeaturedMediaGridProps = {
  items: PortfolioItem[];
};

export function FeaturedMediaGrid({ items }: FeaturedMediaGridProps) {
  return (
    <div className="featured-grid">
      {items.map((item, index) => (
        <article
          key={item.id}
          className={`featured-grid__item featured-grid__item--${index + 1}`}
          data-reveal
        >
          <div className="featured-grid__media">
            {item.mediaType === 'video' ? (
              <video src={item.src} poster={item.posterSrc} muted autoPlay loop playsInline />
            ) : (
              <img src={item.thumbnailSrc} alt={item.alt} loading="lazy" />
            )}
          </div>
          <div className="featured-grid__body">
            <div>
              <p className="eyebrow">{item.categorySlug}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Link to={`/portfolio?category=${item.categorySlug}`} className="button button--ghost">
              Explore {item.categorySlug}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
