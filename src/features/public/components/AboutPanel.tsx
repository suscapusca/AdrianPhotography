import type { AboutContent } from '@/shared/lib/content-schema';

type AboutPanelProps = {
  about: AboutContent;
};

export function AboutPanel({ about }: AboutPanelProps) {
  return (
    <section className="about-panel">
      <div className="about-panel__media" data-reveal>
        <img src={about.portraitSrc} alt={about.portraitAlt} loading="lazy" />
      </div>
      <div className="about-panel__body">
        <div data-reveal>
          <p className="eyebrow">About</p>
          <h2>{about.title}</h2>
          <p className="about-panel__lead">{about.subtitle}</p>
        </div>
        <p data-reveal>{about.body}</p>
        <blockquote data-reveal>{about.philosophy}</blockquote>
      </div>
    </section>
  );
}
