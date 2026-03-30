import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <div className="site-header__panel">
          <Link to="/" className="brand-block" aria-label="Schipor Adrian home">
            <span className="brand-mark">Schipor Adrian</span>
            <span className="brand-submark">Photographer / Visual Storyteller</span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'site-nav__link is-active' : 'site-nav__link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <span className="site-header__status">
              <span aria-hidden="true" />
              Available for commissions
            </span>

            <Link to="/contact" className="button button--ghost site-header__cta">
              Start a Project
            </Link>

            <button
              type="button"
              className={`menu-toggle ${isOpen ? 'is-open' : ''}`}
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu__panel">
          <p className="mobile-menu__eyebrow">Available for commissions</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="mobile-menu__link"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/contact" className="button button--primary" onClick={() => setIsOpen(false)}>
            Start an Inquiry
          </Link>
        </div>
      </div>
    </header>
  );
}
