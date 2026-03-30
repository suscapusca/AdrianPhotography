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
  const values = [
    'Art direction that feels intuitive, not forced',
    'A premium edit that still preserves warmth and humanity',
    'An approach suited to both personal storytelling and client-facing work',
  ];

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
          <h1>Photography that values atmosphere as much as clarity, trust, and restraint.</h1>
          <p>
            Adrian’s positioning is now more deliberate: artistic enough to feel memorable, and
            structured enough to reassure clients they are in experienced hands.
          </p>
        </div>
      </section>

      <div className="page-section-stack" ref={revealRef}>
        <section className="section">
          <AboutPanel about={site.about} />
        </section>

        <section className="section section--narrow">
          <div className="editorial-values">
            {values.map((value) => (
              <article key={value} className="editorial-card" data-reveal>
                <p className="eyebrow">Approach</p>
                <h3>{value}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Focus"
            title="A practice that moves comfortably between people, spaces, atmosphere, and motion."
            description="The new structure makes that range clearer while keeping the visual language consistent from one category to the next."
          />
          <CategoryStrip categories={categories} />
        </section>
      </div>
    </>
  );
}
