import { FormEvent, useState } from 'react';
import type { ContactContent } from '@/shared/lib/content-schema';

type ContactBlockProps = {
  contact: ContactContent;
};

export function ContactBlock({ contact }: ContactBlockProps) {
  const [status, setStatus] = useState<string | null>(null);
  const directLinks = [
    { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, '')}` },
    { label: 'LinkedIn', value: 'adrian-schipor', href: contact.linkedin },
    { label: 'Instagram', value: `@${contact.instagramHandle}`, href: contact.instagram },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const project = String(form.get('project') ?? '');
    const message = String(form.get('message') ?? '');

    const subject = encodeURIComponent(`Inquiry from ${name} | ${project}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject: ${project}\n\n${message}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setStatus('Your email client is opening with a prepared inquiry.');
  };

  return (
    <section className="contact-block">
      <div className="contact-block__meta">
        <div data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>{contact.title}</h2>
          <p>{contact.description}</p>
        </div>
        <div className="contact-block__channels" data-reveal>
          {directLinks.map((link) => (
            <a key={link.label} className="contact-block__channel" href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
              <span>{link.label}</span>
              <strong>{link.value}</strong>
            </a>
          ))}
        </div>
        <div className="contact-block__details" data-reveal>
          <span>{contact.location}</span>
          <span>Typical response window: within 48 hours.</span>
          <span>Open to private commissions, editorial work, and select brand collaborations.</span>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} data-reveal>
        <div className="contact-form__grid">
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Project Type
            <input name="project" type="text" placeholder="Event, portrait, destination..." required />
          </label>
          <label>
            Timeline
            <input name="timeline" type="text" placeholder="Month, date, or desired timeframe" />
          </label>
        </div>
        <label>
          Message
          <textarea name="message" rows={6} placeholder="Tell me about the story, mood, deliverables, and location." required />
        </label>
        <button type="submit" className="button button--primary">
          {contact.inquiryCtaLabel}
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </section>
  );
}
