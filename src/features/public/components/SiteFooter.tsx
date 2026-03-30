import type { ContactContent } from '@/shared/lib/content-schema';

type SiteFooterProps = {
  contact: ContactContent | null | undefined;
};

export function SiteFooter({ contact }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Schipor Adrian</p>
        <h2>Premium photography for people, places, and unforgettable moments.</h2>
      </div>
      <div className="site-footer__meta">
        <a href={`mailto:${contact?.email ?? 'schipor.adiy@gmail.com'}`}>
          {contact?.email ?? 'schipor.adiy@gmail.com'}
        </a>
        <a href={contact?.linkedin ?? 'https://linkedin.com/in/adrian-schipor'} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={contact?.instagram ?? 'https://instagram.com/adrian_schipor'} target="_blank" rel="noreferrer">
          Instagram / @{contact?.instagramHandle ?? 'adrian_schipor'}
        </a>
        <p>{contact?.location ?? 'Melbourne, Australia / Available internationally'}</p>
      </div>
    </footer>
  );
}
