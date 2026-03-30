import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { useSectionReveal } from '@/shared/hooks/useSectionReveal';
import { AboutPanel } from '../components/AboutPanel';
import { CategoryStrip } from '../components/CategoryStrip';
import { ContactBlock } from '../components/ContactBlock';
import { FeaturedMediaGrid } from '../components/FeaturedMediaGrid';
import { HeroCinematic } from '../components/HeroCinematic';
import { SectionIntro } from '../components/SectionIntro';
import { ServicesList } from '../components/ServicesList';
import { usePublicSiteData } from '../hooks/usePublicSiteData';

export function HomePage() {
  const { site, categories, portfolio, loading, error } = usePublicSiteData();
  const revealRef = useSectionReveal<HTMLDivElement>([site, categories, portfolio]);

  if (loading && !site) {
    return <LoadingState />;
  }

  if (!site || error) {
    return (
      <EmptyState
        title="The portfolio is getting its final polish."
        body={error ?? 'Public content is not available yet.'}
      />
    );
  }

  const featuredCategories = site.hero.featuredCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is (typeof categories)[number] => Boolean(category));

  const featuredItems = site.homepageSettings.featuredItemIds
    .map((itemId) => portfolio.find((item) => item.id === itemId))
    .filter((item): item is (typeof portfolio)[number] => Boolean(item));

  return (
    <>
      <Seo
        title="Schipor Adrian | Photographer & Visual Storyteller"
        description={site.hero.description}
      />

      <HeroCinematic hero={site.hero} categories={featuredCategories} />

      <div className="page-section-stack" ref={revealRef}>
        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Categories"
            title="A portfolio shaped by mood, motion, and honest detail."
            description="Each category is approached with its own rhythm, but the visual language stays elegant, restrained, and immersive."
          />
          <CategoryStrip categories={featuredCategories} />
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Selected Work"
            title={site.featuredCollection.title}
            description={site.featuredCollection.description}
          />
          <FeaturedMediaGrid items={featuredItems} />
        </section>

        <section className="section section--split">
          <AboutPanel about={site.about} />
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Work Types"
            title="Photography built to feel polished, cinematic, and deeply human."
            description="From intimate portraits to large event atmospheres, the workflow adapts to the story rather than forcing a house style onto it."
          />
          <ServicesList services={site.services} />
        </section>

        <section className="section">
          <ContactBlock contact={site.contact} />
        </section>
      </div>
    </>
  );
}
