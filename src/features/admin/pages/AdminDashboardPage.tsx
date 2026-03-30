import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { apiRequest } from '@/shared/lib/api';
import type { Category, PortfolioItem, SiteContent } from '@/shared/lib/content-schema';

type DashboardData = {
  site: SiteContent;
  categories: Category[];
  portfolio: PortfolioItem[];
  uploads: Array<{ filename: string; url: string; size: number; updatedAt: string }>;
};

export function AdminDashboardPage() {
  const { data, loading, error } = useAsyncData<DashboardData>(async () => {
    const [site, categories, portfolio, uploads] = await Promise.all([
      apiRequest<SiteContent>('/api/admin/site'),
      apiRequest<Category[]>('/api/admin/categories'),
      apiRequest<PortfolioItem[]>('/api/admin/portfolio'),
      apiRequest<Array<{ filename: string; url: string; size: number; updatedAt: string }>>(
        '/api/admin/uploads',
      ),
    ]);

    return { site, categories, portfolio, uploads };
  }, []);

  if (loading && !data) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (!data || error) {
    return <EmptyState title="Dashboard unavailable." body={error ?? 'Try refreshing the page.'} />;
  }

  const publishedCount = data.portfolio.filter((item) => item.published).length;
  const featuredCount = data.portfolio.filter((item) => item.featured).length;
  const hiddenCategories = data.categories.filter((item) => !item.visible).length;

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Portfolio control center</h2>
        </div>
      </header>

      <div className="admin-stats">
        <article className="admin-stat-card">
          <span>Published items</span>
          <strong>{publishedCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Featured items</span>
          <strong>{featuredCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Visible categories</span>
          <strong>{data.categories.length - hiddenCategories}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Uploaded files</span>
          <strong>{data.uploads.length}</strong>
        </article>
      </div>

      <div className="admin-grid admin-grid--dashboard">
        <section className="admin-card">
          <h3>Hero snapshot</h3>
          <p>{data.site.hero.tagline}</p>
          <div className="admin-pill-row">
            {data.site.hero.featuredCategorySlugs.map((slug) => (
              <span key={slug} className="admin-pill">
                {slug}
              </span>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h3>Featured work</h3>
          <ul className="admin-list">
            {data.portfolio
              .filter((item) => item.featured)
              .slice(0, 4)
              .map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>
                    {item.categorySlug} / {item.year}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Contact card</h3>
          <ul className="admin-list">
            <li>
              <strong>Email</strong>
              <span>{data.site.contact.email}</span>
            </li>
            <li>
              <strong>Phone</strong>
              <span>{data.site.contact.phone}</span>
            </li>
            <li>
              <strong>Location</strong>
              <span>{data.site.contact.location}</span>
            </li>
          </ul>
        </section>

        <section className="admin-card">
          <h3>Recent uploads</h3>
          <ul className="admin-list">
            {data.uploads.slice(0, 4).map((file) => (
              <li key={file.filename}>
                <strong>{file.filename}</strong>
                <span>{new Date(file.updatedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
