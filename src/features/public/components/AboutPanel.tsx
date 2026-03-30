import type { AboutContent } from '@/shared/lib/content-schema';

type AboutPanelProps = {
  about: AboutContent;
};

export function AboutPanel({ about }: AboutPanelProps) {
  const principles = [
    'Editorial composition over visual noise',
    'Direction that feels calm, not staged',
    'Delivery built for both clients and portfolio use',
  ];

  return (
    <section className="about-panel">
      <div className="about-panel__media" data-reveal>
        <img src={about.portraitSrc} alt={about.portraitAlt} loading="lazy" />
        <div className="about-panel__media-caption">
          <span>Melbourne-based</span>
          <span>Available internationally</span>
        </div>
      </div>
      <div className="about-panel__body">
        <div data-reveal>
          <p className="eyebrow">About</p>
          <h2>{about.title}</h2>
          <p className="about-panel__lead">{about.subtitle}</p>
        </div>
        <p data-reveal>{about.body}</p>
        <div className="about-panel__principles" data-reveal>
          {principles.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </div>
        <blockquote data-reveal>{about.philosophy}</blockquote>
      </div>
    </section>
  );
}
