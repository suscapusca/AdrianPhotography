import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { useSectionReveal } from '@/shared/hooks/useSectionReveal';
import { AboutPanel } from '../components/AboutPanel';
import { CategoryStrip } from '../components/CategoryStrip';
import { SectionIntro } from '../components/SectionIntro';
import { usePublicSiteData } from '../hooks/usePublicSiteData';

export function AboutPage() {
  const { site, categories, loading, error } = usePublicSiteData();
  const revealRef = useSectionReveal<HTMLDivElement>([site, categories]);

  if (loading && !site) {
    return <LoadingState />;
  }

  if (!site || error) {
    return <EmptyState title="About content unavailable." body={error ?? 'Please check back soon.'} />;
  }

  return (
    <>
      <Seo title="About | Schipor Adrian" description={site.about.subtitle} />

      <section className="page-hero page-hero--compact">
        <div className="page-hero__content">
          <p className="eyebrow">About</p>
          <h1>Photography that values atmosphere as much as clarity.</h1>
          <p>{site.about.subtitle}</p>
        </div>
      </section>

      <div className="page-section-stack" ref={revealRef}>
        <section className="section">
          <AboutPanel about={site.about} />
        </section>

        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Focus"
            title="Stories across people, spaces, weather, and motion."
            description="The portfolio moves between private moments and broader environments, always with the same attention to tone."
          />
          <CategoryStrip categories={categories} />
        </section>
      </div>
    </>
  );
}
