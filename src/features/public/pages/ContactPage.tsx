import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { useSectionReveal } from '@/shared/hooks/useSectionReveal';
import { ContactBlock } from '../components/ContactBlock';
import { SectionIntro } from '../components/SectionIntro';
import { usePublicSiteData } from '../hooks/usePublicSiteData';

export function ContactPage() {
  const { site, loading, error } = usePublicSiteData();
  const revealRef = useSectionReveal<HTMLDivElement>([site]);
  const expectations = [
    'Useful for commissions, events, portraits, editorial assignments, and travel stories.',
    'The best inquiries mention mood, timeline, location, and final usage.',
    'The reply is shaped around fit, availability, and how the work can be approached well.',
  ];

  if (loading && !site) {
    return <LoadingState />;
  }

  if (!site || error) {
    return <EmptyState title="Contact details unavailable." body={error ?? 'Please try again soon.'} />;
  }

  return (
    <>
      <Seo title="Contact | Schipor Adrian" description={site.contact.description} />

      <section className="page-hero page-hero--compact">
        <div className="page-hero__content">
          <p className="eyebrow">Contact</p>
          <h1>Bring the next project into focus with a clearer, more premium inquiry flow.</h1>
          <p>
            Share the mood, scope, and timeline. The reply can shape itself around a commission,
            collaboration, portrait session, or destination story.
          </p>
        </div>
      </section>

      <section className="section" ref={revealRef}>
        <div className="editorial-values editorial-values--contact">
          {expectations.map((expectation) => (
            <article key={expectation} className="editorial-card" data-reveal>
              <p className="eyebrow">Before you write</p>
              <h3>{expectation}</h3>
            </article>
          ))}
        </div>

        <SectionIntro
          eyebrow="Inquiry"
          title="The easiest way to begin is still a clear message and a few useful details."
          description="The experience is now more reassuring and better structured for potential clients who want to move quickly and confidently."
        />
        <ContactBlock contact={site.contact} />
      </section>
    </>
  );
}
