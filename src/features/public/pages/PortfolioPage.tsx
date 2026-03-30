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

      <section className="page-hero page-hero--compact">
        <div className="page-hero__content">
          <p className="eyebrow">Portfolio</p>
          <h1>Stories arranged with calm precision and cinematic depth.</h1>
          <p>
            Browse by category, open individual works fullscreen, and move through the
            collection with keyboard navigation.
          </p>
          {site.homepageSettings.showLightboxHint ? (
            <span className="page-note">Tip: use arrow keys inside the fullscreen viewer.</span>
          ) : null}
        </div>
      </section>

      <section className="section" ref={revealRef}>
        <SectionIntro
          eyebrow="Gallery"
          title="Responsive, refined, and built around the work itself."
          description="Photos and motion pieces share the same visual system so the portfolio feels unified across categories."
        />

        <PortfolioGallery
          items={visibleItems}
          categories={categories}
          activeCategory={activeCategory}
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
