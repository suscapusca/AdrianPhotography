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
          <h1>Bring the next project into focus.</h1>
          <p>
            Share the mood, scope, and timeline. The reply can shape itself around a commission,
            collaboration, portrait session, or destination story.
          </p>
        </div>
      </section>

      <section className="section" ref={revealRef}>
        <SectionIntro
          eyebrow="Inquiry"
          title="The easiest way to begin is with a clear message and a few details."
          description="The contact form prepares an email draft so you can send a fully framed inquiry in one step."
        />
        <ContactBlock contact={site.contact} />
      </section>
    </>
  );
}
