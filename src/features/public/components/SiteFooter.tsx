import { Link } from 'react-router-dom';
import type { ContactContent } from '@/shared/lib/content-schema';

type SiteFooterProps = {
  contact: ContactContent | null | undefined;
};

const footerNav = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export function SiteFooter({ contact }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__intro">
        <p className="eyebrow">Schipor Adrian</p>
        <h2>Photography that feels composed, contemporary, and quietly unforgettable.</h2>
        <p>
          Built for events, portraits, places, and visual stories that need both emotional
          depth and commercial polish.
        </p>
        <Link to="/contact" className="button button--primary">
          Start an Inquiry
        </Link>
      </div>

      <div className="site-footer__grid">
        <div className="site-footer__column">
          <span className="site-footer__label">Navigate</span>
          {footerNav.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">Contact</span>
          <a href={`mailto:${contact?.email ?? 'schipor.adiy@gmail.com'}`}>
            {contact?.email ?? 'schipor.adiy@gmail.com'}
          </a>
          <a href={`tel:${(contact?.phone ?? '+44 7950 742079').replace(/\s+/g, '')}`}>
            {contact?.phone ?? '+44 7950 742079'}
          </a>
          <a
            href={contact?.linkedin ?? 'https://linkedin.com/in/adrian-schipor'}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={contact?.instagram ?? 'https://instagram.com/adrian_schipor'}
            target="_blank"
            rel="noreferrer"
          >
            Instagram / @{contact?.instagramHandle ?? 'adrian_schipor'}
          </a>
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">Based In</span>
          <p>{contact?.location ?? 'Melbourne, Australia / Available internationally'}</p>
          <p>Reply window: usually within 48 hours for commissions and collaborations.</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>Schipor Adrian</span>
        <span>Editorial photography, event coverage, portraits, and visual storytelling.</span>
      </div>
    </footer>
  );
}
