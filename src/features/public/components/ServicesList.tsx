import type { ServiceItem } from '@/shared/lib/content-schema';

type ServicesListProps = {
  services: ServiceItem[];
};

export function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="services-grid">
      {services.map((service) => (
        <article key={service.id} className="service-card" data-reveal>
          <p className="eyebrow">Service</p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <ul>
            {service.deliverables.map((deliverable) => (
              <li key={deliverable}>{deliverable}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
