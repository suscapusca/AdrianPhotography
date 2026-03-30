import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { useSectionReveal } from '@/shared/hooks/useSectionReveal';
import { SectionIntro } from '../components/SectionIntro';
import { ServicesList } from '../components/ServicesList';
import { usePublicSiteData } from '../hooks/usePublicSiteData';

const processSteps = [
  {
    title: 'Discovery',
    description: 'We define the visual mood, key deliverables, locations, and timing before the first frame is made.',
  },
  {
    title: 'Direction',
    description: 'Each shoot is guided with a quiet, intentional rhythm so the final work feels composed but never rigid.',
  },
  {
    title: 'Delivery',
    description: 'You receive a refined edit built for premium presentation, social use, and long-term portfolio value.',
  },
];

export function ServicesPage() {
  const { site, loading, error } = usePublicSiteData();
  const revealRef = useSectionReveal<HTMLDivElement>([site]);
  const servicePromises = [
    'Shot lists and visual tone aligned before the day',
    'Direction that keeps shoots calm and efficient',
    'Final edits prepared for premium presentation and client use',
  ];

  if (loading && !site) {
    return <LoadingState />;
  }

  if (!site || error) {
    return <EmptyState title="Services are unavailable." body={error ?? 'Please try again later.'} />;
  }

  return (
    <>
      <Seo
        title="Services | Schipor Adrian"
        description="Event coverage, portrait sessions, places, and nature photography with cinematic polish."
      />

      <section className="page-hero page-hero--compact">
        <div className="page-hero__content">
          <p className="eyebrow">Services</p>
          <h1>Commissioned work with a calmer process, stronger positioning, and a more premium finish.</h1>
          <p>
            Whether the assignment is intimate or expansive, the approach stays focused on atmosphere,
            pacing, and emotionally resonant frames.
          </p>
        </div>
      </section>

      <div className="page-section-stack" ref={revealRef}>
        <section className="section">
          <SectionIntro
            eyebrow="Offerings"
            title="Offerings designed to feel commercially credible as well as visually rich."
            description="The language, layout, and delivery cues here are more client-aware, which helps the site convert without becoming salesy."
          />
          <ServicesList services={site.services} />
        </section>

        <section className="section section--narrow">
          <div className="editorial-values">
            {servicePromises.map((promise) => (
              <article key={promise} className="editorial-card" data-reveal>
                <p className="eyebrow">What clients get</p>
                <h3>{promise}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--narrow">
          <SectionIntro
            eyebrow="Process"
            title="Simple on the surface, carefully directed underneath."
            description="This section now supports the brand more clearly: it reassures visitors that the work is not only beautiful, but professionally run."
          />
          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.title} className="process-card" data-reveal>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
