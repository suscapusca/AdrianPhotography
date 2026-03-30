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

  const trustSignals = [
    'For private commissions, editorials, and event coverage',
    'Photography-first direction with motion sensitivity',
    'Based in Melbourne, available internationally',
  ];

  const clientReasons = [
    {
      title: 'Clear art direction',
      body: 'Shoots are guided with enough intention to feel elevated, while still leaving room for honest moments.',
    },
    {
      title: 'Polished delivery',
      body: 'Edits are composed for premium presentation across galleries, decks, socials, and client handoff.',
    },
    {
      title: 'Calm collaboration',
      body: 'The process stays structured, communicative, and low-friction for brands, teams, and private clients.',
    },
  ];

  return (
    <>
      <Seo
        title="Schipor Adrian | Photographer & Visual Storyteller"
        description={site.hero.description}
      >
        <link rel="preload" as="image" href={site.hero.heroMedia.poster} />
      </Seo>

      <HeroCinematic hero={site.hero} categories={featuredCategories} />

      <div className="page-section-stack" ref={revealRef}>
        <section className="section section--tight">
          <div className="trust-band" data-reveal>
            {trustSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </section>

        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Selected Work"
            title="A tighter, more editorial way to enter the portfolio."
            description="Instead of asking visitors to decode the work alone, the homepage now leads with a curated story selection and a clearer sense of style, mood, and capability."
          />
          <FeaturedMediaGrid items={featuredItems} />
        </section>

        <section className="section">
          <div className="home-editorial">
            <div className="home-editorial__intro" data-reveal>
              <p className="eyebrow">Positioning</p>
              <h2>Made to feel artistic enough for personal work and credible enough for serious clients.</h2>
              <p>
                The experience is intentionally quieter and more structured than a typical
                photographer portfolio. The imagery leads, but the surrounding system builds trust,
                confidence, and clarity.
              </p>
            </div>

            <div className="home-editorial__grid">
              {clientReasons.map((reason) => (
                <article key={reason.title} className="editorial-card" data-reveal>
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Categories"
            title="Distinct bodies of work, one coherent photographic voice."
            description="Events, places, nature, and people are easier to browse, easier to understand, and framed with stronger visual hierarchy."
          />
          <CategoryStrip categories={featuredCategories} items={portfolio} />
        </section>

        <section className="section section--split">
          <AboutPanel about={site.about} />
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Work Types"
            title="Services shaped for commissions, not just portfolio aesthetics."
            description="Each offering is framed around how real clients buy and use photography: clarity before the shoot, calm direction on the day, and polished delivery afterwards."
          />
          <ServicesList services={site.services} />
        </section>

        <section className="section section--narrow">
          <div className="cta-panel" data-reveal>
            <div>
              <p className="eyebrow">Availability</p>
              <h2>Open for commissions, collaborations, portrait sessions, and destination stories.</h2>
            </div>
            <p>
              The quickest way to start is a short inquiry with the story, timing, and atmosphere
              you want to create.
            </p>
          </div>
        </section>

        <section className="section">
          <ContactBlock contact={site.contact} />
        </section>
      </div>
    </>
  );
}
