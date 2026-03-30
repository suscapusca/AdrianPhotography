import { Link } from 'react-router-dom';
import type { PortfolioItem } from '@/shared/lib/content-schema';

type FeaturedMediaGridProps = {
  items: PortfolioItem[];
};

export function FeaturedMediaGrid({ items }: FeaturedMediaGridProps) {
  const [leadItem, ...supportingItems] = items;

  if (!leadItem) {
    return null;
  }

  return (
    <div className="featured-grid">
      <article className="featured-grid__lead" data-reveal>
        <div className="featured-grid__lead-media">
          {leadItem.mediaType === 'video' ? (
            <video src={leadItem.src} poster={leadItem.posterSrc} muted autoPlay loop playsInline />
          ) : (
            <img src={leadItem.thumbnailSrc} alt={leadItem.alt} loading="lazy" />
          )}
          <div className="featured-grid__lead-overlay" />
        </div>
        <div className="featured-grid__lead-body">
          <div>
            <p className="eyebrow">{leadItem.categorySlug}</p>
            <h3>{leadItem.title}</h3>
            <p>{leadItem.longDescription}</p>
          </div>

          <div className="featured-grid__lead-meta">
            <span>{leadItem.location}</span>
            <span>{leadItem.year}</span>
            <span>{leadItem.mediaType === 'video' ? 'Motion study' : 'Photography'}</span>
          </div>

          <Link to={`/portfolio?category=${leadItem.categorySlug}`} className="button button--primary">
            Explore {leadItem.categorySlug}
          </Link>
        </div>
      </article>

      <div className="featured-grid__stack">
        {supportingItems.map((item) => (
          <article key={item.id} className="featured-grid__item" data-reveal>
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
              <div className="featured-grid__meta">
                <span>{item.location}</span>
                <span>{item.year}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
