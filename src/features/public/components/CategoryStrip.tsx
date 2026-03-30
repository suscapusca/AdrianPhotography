import { Link } from 'react-router-dom';
import type { Category, PortfolioItem } from '@/shared/lib/content-schema';

type CategoryStripProps = {
  categories: Category[];
  items?: PortfolioItem[];
};

export function CategoryStrip({ categories, items = [] }: CategoryStripProps) {
  return (
    <div className="category-strip">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/portfolio?category=${category.slug}`}
          className="category-strip__card"
          data-reveal
        >
          <div className="category-strip__media">
            {items.find((item) => item.categorySlug === category.slug)?.thumbnailSrc ? (
              <img
                src={items.find((item) => item.categorySlug === category.slug)?.thumbnailSrc}
                alt=""
                loading="lazy"
                aria-hidden="true"
              />
            ) : null}
            <div className="category-strip__shade" />
          </div>

          <div className="category-strip__content">
            <p>{category.accent}</p>
            <h3>{category.name}</h3>
            <span>{category.description}</span>
            <strong>View story selection</strong>
          </div>
        </Link>
      ))}
    </div>
  );
}
