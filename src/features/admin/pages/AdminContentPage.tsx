import { useEffect, useState } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { apiRequest } from '@/shared/lib/api';
import type { Category, PortfolioItem, SiteContent } from '@/shared/lib/content-schema';
import { MediaUploadForm } from '../components/MediaUploadForm';

type ContentBundle = {
  site: SiteContent;
  categories: Category[];
  portfolio: PortfolioItem[];
};

export function AdminContentPage() {
  const { data, loading, error, reload } = useAsyncData<ContentBundle>(async () => {
    const [site, categories, portfolio] = await Promise.all([
      apiRequest<SiteContent>('/api/admin/site'),
      apiRequest<Category[]>('/api/admin/categories'),
      apiRequest<PortfolioItem[]>('/api/admin/portfolio'),
    ]);

    return { site, categories, portfolio };
  }, []);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<string>('');

  useEffect(() => {
    if (data?.site) {
      setDraft(data.site);
    }
  }, [data]);

  if (loading && !draft) {
    return <LoadingState label="Loading content editor..." />;
  }

  if (!draft || !data || error) {
    return <EmptyState title="Content editor unavailable." body={error ?? 'Please try again.'} />;
  }

  const toggleFeaturedItem = (itemId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            homepageSettings: {
              ...current.homepageSettings,
              featuredItemIds: current.homepageSettings.featuredItemIds.includes(itemId)
                ? current.homepageSettings.featuredItemIds.filter((id) => id !== itemId)
                : [...current.homepageSettings.featuredItemIds, itemId],
            },
          }
        : current,
    );
  };

  const toggleFeaturedCategory = (slug: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            homepageSettings: {
              ...current.homepageSettings,
              featuredCategorySlugs: current.homepageSettings.featuredCategorySlugs.includes(slug)
                ? current.homepageSettings.featuredCategorySlugs.filter((item) => item !== slug)
                : [...current.homepageSettings.featuredCategorySlugs, slug],
            },
          }
        : current,
    );
  };

  const handleSave = async () => {
    await apiRequest<SiteContent>('/api/admin/site', {
      method: 'PUT',
      body: draft,
    });
    setStatus('Site content saved.');
    await reload();
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow">Content</p>
          <h2>Edit homepage hero, about copy, services, and contact details.</h2>
        </div>
        <button type="button" className="button button--primary" onClick={() => void handleSave()}>
          Save site content
        </button>
      </header>

      <div className="admin-grid">
        <section className="admin-card">
          <MediaUploadForm onUploaded={(file) => setLastUpload(file.url)} />
          {lastUpload ? (
            <div className="admin-pill-row">
              <button
                type="button"
                className="admin-pill admin-pill--button"
                onClick={() =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: { ...current.hero.heroMedia, src: lastUpload },
                          },
                        }
                      : current,
                  )
                }
              >
                Use for hero media
              </button>
              <button
                type="button"
                className="admin-pill admin-pill--button"
                onClick={() =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          about: {
                            ...current.about,
                            portraitSrc: lastUpload,
                          },
                        }
                      : current,
                  )
                }
              >
                Use for about portrait
              </button>
            </div>
          ) : null}
        </section>

        <section className="admin-card">
          <h3>Hero</h3>
          <div className="admin-form admin-form--two-columns">
            <label>
              Eyebrow
              <input
                value={draft.hero.eyebrow}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, hero: { ...current.hero, eyebrow: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Tagline
              <input
                value={draft.hero.tagline}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, hero: { ...current.hero, tagline: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            {draft.hero.headlineLines.map((line, index) => (
              <label key={`${line}-${index}`}>
                Headline line {index + 1}
                <input
                  value={line}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            hero: {
                              ...current.hero,
                              headlineLines: current.hero.headlineLines.map((entry, entryIndex) =>
                                entryIndex === index ? event.target.value : entry,
                              ),
                            },
                          }
                        : current,
                    )
                  }
                />
              </label>
            ))}
            <button
              type="button"
              className="button button--ghost"
              onClick={() =>
                setDraft((current) =>
                  current
                    ? {
                        ...current,
                        hero: {
                          ...current.hero,
                          headlineLines: [...current.hero.headlineLines, 'New headline line'],
                        },
                      }
                    : current,
                )
              }
            >
              Add headline line
            </button>
            <label className="admin-form__full">
              Description
              <textarea
                rows={4}
                value={draft.hero.description}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, hero: { ...current.hero, description: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Primary CTA label
              <input
                value={draft.hero.primaryCta.label}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            primaryCta: { ...current.hero.primaryCta, label: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Primary CTA href
              <input
                value={draft.hero.primaryCta.href}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            primaryCta: { ...current.hero.primaryCta, href: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Secondary CTA label
              <input
                value={draft.hero.secondaryCta.label}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            secondaryCta: { ...current.hero.secondaryCta, label: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Secondary CTA href
              <input
                value={draft.hero.secondaryCta.href}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            secondaryCta: { ...current.hero.secondaryCta, href: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h3>Hero media and stats</h3>
          <div className="admin-form admin-form--two-columns">
            <label>
              Hero media type
              <select
                value={draft.hero.heroMedia.type}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: {
                              ...current.hero.heroMedia,
                              type: event.target.value as 'photo' | 'video',
                            },
                          },
                        }
                      : current,
                  )
                }
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>
              Hero media title
              <input
                value={draft.hero.heroMedia.title}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: { ...current.hero.heroMedia, title: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label className="admin-form__full">
              Hero media src
              <input
                value={draft.hero.heroMedia.src}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: { ...current.hero.heroMedia, src: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label className="admin-form__full">
              Hero poster
              <input
                value={draft.hero.heroMedia.poster}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: { ...current.hero.heroMedia, poster: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label className="admin-form__full">
              Hero alt text
              <input
                value={draft.hero.heroMedia.alt}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          hero: {
                            ...current.hero,
                            heroMedia: { ...current.hero.heroMedia, alt: event.target.value },
                          },
                        }
                      : current,
                  )
                }
              />
            </label>
            {draft.hero.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="admin-inline-pair">
                <label>
                  Stat label
                  <input
                    value={stat.label}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              hero: {
                                ...current.hero,
                                stats: current.hero.stats.map((entry, entryIndex) =>
                                  entryIndex === index
                                    ? { ...entry, label: event.target.value }
                                    : entry,
                                ),
                              },
                            }
                          : current,
                      )
                    }
                  />
                </label>
                <label>
                  Stat value
                  <input
                    value={stat.value}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              hero: {
                                ...current.hero,
                                stats: current.hero.stats.map((entry, entryIndex) =>
                                  entryIndex === index
                                    ? { ...entry, value: event.target.value }
                                    : entry,
                                ),
                              },
                            }
                          : current,
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h3>About</h3>
          <div className="admin-form">
            <label>
              Title
              <input
                value={draft.about.title}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, about: { ...current.about, title: event.target.value } } : current,
                  )
                }
              />
            </label>
            <label>
              Subtitle
              <textarea
                rows={3}
                value={draft.about.subtitle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, about: { ...current.about, subtitle: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Body
              <textarea
                rows={5}
                value={draft.about.body}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, about: { ...current.about, body: event.target.value } } : current,
                  )
                }
              />
            </label>
            <label>
              Philosophy
              <textarea
                rows={3}
                value={draft.about.philosophy}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, about: { ...current.about, philosophy: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Portrait src
              <input
                value={draft.about.portraitSrc}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, about: { ...current.about, portraitSrc: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Portrait alt
              <input
                value={draft.about.portraitAlt}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, about: { ...current.about, portraitAlt: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h3>Services</h3>
          <div className="admin-form">
            {draft.services.map((service, index) => (
              <div key={service.id} className="admin-subsection">
                <label>
                  Title
                  <input
                    value={service.title}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              services: current.services.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, title: event.target.value } : entry,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows={3}
                    value={service.description}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              services: current.services.map((entry, entryIndex) =>
                                entryIndex === index
                                  ? { ...entry, description: event.target.value }
                                  : entry,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                </label>
                <label>
                  Deliverables
                  <input
                    value={service.deliverables.join(', ')}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              services: current.services.map((entry, entryIndex) =>
                                entryIndex === index
                                  ? {
                                      ...entry,
                                      deliverables: event.target.value
                                        .split(',')
                                        .map((item) => item.trim())
                                        .filter(Boolean),
                                    }
                                  : entry,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h3>Contact</h3>
          <div className="admin-form admin-form--two-columns">
            <label>
              Title
              <input
                value={draft.contact.title}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, title: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Inquiry CTA
              <input
                value={draft.contact.inquiryCtaLabel}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          contact: { ...current.contact, inquiryCtaLabel: event.target.value },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label className="admin-form__full">
              Description
              <textarea
                rows={3}
                value={draft.contact.description}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, description: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Email
              <input
                value={draft.contact.email}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, email: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Phone
              <input
                value={draft.contact.phone}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, phone: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              LinkedIn
              <input
                value={draft.contact.linkedin}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, linkedin: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Instagram
              <input
                value={draft.contact.instagram}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, instagram: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Instagram handle
              <input
                value={draft.contact.instagramHandle}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          contact: { ...current.contact, instagramHandle: event.target.value },
                        }
                      : current,
                  )
                }
              />
            </label>
            <label>
              Location
              <input
                value={draft.contact.location}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? { ...current, contact: { ...current.contact, location: event.target.value } }
                      : current,
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h3>Homepage controls</h3>
          <div className="admin-form">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={draft.homepageSettings.showLightboxHint}
                onChange={(event) =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          homepageSettings: {
                            ...current.homepageSettings,
                            showLightboxHint: event.target.checked,
                          },
                        }
                      : current,
                  )
                }
              />
              Show fullscreen viewer tip on portfolio page
            </label>

            <div>
              <p className="admin-subheading">Homepage featured items</p>
              <div className="admin-pill-row">
                {data.portfolio.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`admin-pill admin-pill--button ${
                      draft.homepageSettings.featuredItemIds.includes(item.id) ? 'is-active' : ''
                    }`}
                    onClick={() => toggleFeaturedItem(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="admin-subheading">Homepage featured categories</p>
              <div className="admin-pill-row">
                {data.categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`admin-pill admin-pill--button ${
                      draft.homepageSettings.featuredCategorySlugs.includes(category.slug)
                        ? 'is-active'
                        : ''
                    }`}
                    onClick={() => toggleFeaturedCategory(category.slug)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="admin-page__footer">
        <button type="button" className="button button--primary" onClick={() => void handleSave()}>
          Save site content
        </button>
        {status ? <p className="form-status">{status}</p> : null}
      </div>
    </section>
  );
}
