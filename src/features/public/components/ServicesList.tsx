import type { ServiceItem } from '@/shared/lib/content-schema';

type ServicesListProps = {
  services: ServiceItem[];
};

export function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="services-grid">
      {services.map((service, index) => (
        <article key={service.id} className="service-card" data-reveal>
          <div className="service-card__header">
            <p className="eyebrow">0{index + 1}</p>
            <span>Commissioned offering</span>
          </div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <ul className="service-card__deliverables">
            {service.deliverables.map((deliverable) => (
              <li key={deliverable}>{deliverable}</li>
            ))}
          </ul>
          <strong className="service-card__note">Tailored around the brief, pace, and final use.</strong>
        </article>
      ))}
    </div>
  );
}
