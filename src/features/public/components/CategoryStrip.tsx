import { Link } from 'react-router-dom';
import type { Category } from '@/shared/lib/content-schema';

type CategoryStripProps = {
  categories: Category[];
};

export function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <div className="category-strip">
      {categories.map((category) => (
        <Link key={category.id} to={`/portfolio?category=${category.slug}`} className="category-strip__card" data-reveal>
          <p>{category.accent}</p>
          <h3>{category.name}</h3>
          <span>{category.description}</span>
        </Link>
      ))}
    </div>
  );
}
