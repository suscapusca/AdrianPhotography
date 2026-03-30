import { FormEvent, useState } from 'react';
import type { ContactContent } from '@/shared/lib/content-schema';

type ContactBlockProps = {
  contact: ContactContent;
};

export function ContactBlock({ contact }: ContactBlockProps) {
  const [status, setStatus] = useState<string | null>(null);

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
        <div className="contact-block__details" data-reveal>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={contact.instagram} target="_blank" rel="noreferrer">
            Instagram / @{contact.instagramHandle}
          </a>
          <span>{contact.location}</span>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} data-reveal>
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
          Message
          <textarea name="message" rows={6} placeholder="Tell me about the story you want to create." required />
        </label>
        <button type="submit" className="button button--primary">
          {contact.inquiryCtaLabel}
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </section>
  );
}
