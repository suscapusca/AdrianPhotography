import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { useSectionReveal } from '@/shared/hooks/useSectionReveal';
import { PortfolioGallery } from '../components/PortfolioGallery';
import { PortfolioLightbox } from '../components/PortfolioLightbox';
import { SectionIntro } from '../components/SectionIntro';
import { usePublicSiteData } from '../hooks/usePublicSiteData';

export function PortfolioPage() {
  const { site, categories, portfolio, loading, error } = usePublicSiteData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const revealRef = useSectionReveal<HTMLDivElement>([portfolio, categories]);

  if (loading && !site) {
    return <LoadingState label="Curating the portfolio..." />;
  }

  if (!site || error) {
    return (
      <EmptyState
        title="The gallery is not available yet."
        body={error ?? 'Try again in a moment.'}
      />
    );
  }

  const activeCategory = searchParams.get('category') ?? 'all';
  const categoryCounts = portfolio.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.categorySlug] = (accumulator[item.categorySlug] ?? 0) + 1;
    return accumulator;
  }, {});
  const visibleItems =
    activeCategory === 'all'
      ? portfolio
      : portfolio.filter((item) => item.categorySlug === activeCategory);

  return (
    <>
      <Seo
        title="Portfolio | Schipor Adrian"
        description="A curated mix of photography and motion work across events, places, nature, and people."
      />

      <section className="page-hero page-hero--compact page-hero--portfolio">
        <div className="page-hero__layout">
          <div className="page-hero__content">
            <p className="eyebrow">Portfolio</p>
            <h1>Stories arranged with more clarity, breathing room, and visual confidence.</h1>
            <p>
              Every category now reads more deliberately, with stronger image framing and a browse
              flow that keeps the work central while still giving visitors context.
            </p>
            {site.homepageSettings.showLightboxHint ? (
              <span className="page-note">Tip: use arrow keys inside the fullscreen viewer.</span>
            ) : null}
          </div>

          <aside className="page-hero__aside">
            <div>
              <span>Visible works</span>
              <strong>{visibleItems.length}</strong>
            </div>
            <div>
              <span>Categories</span>
              <strong>{categories.length}</strong>
            </div>
            <div>
              <span>Availability</span>
              <strong>Commissions open</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" ref={revealRef}>
        <SectionIntro
          eyebrow="Gallery"
          title="The interface is quieter so the photography can carry more weight."
          description="Filters are clearer, cards are more intentional, and the fullscreen view remains the immersive deep-dive for detail and mood."
        />

        <PortfolioGallery
          items={visibleItems}
          categories={categories}
          activeCategory={activeCategory}
          countsByCategory={categoryCounts}
          totalCount={portfolio.length}
          onCategoryChange={(category) =>
            setSearchParams(category === 'all' ? {} : { category })
          }
          onOpen={(index) => setSelectedIndex(index)}
        />
      </section>

      {selectedIndex !== null ? (
        <PortfolioLightbox
          items={visibleItems}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      ) : null}
    </>
  );
}
