import { useEffect, useState } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { apiRequest } from '@/shared/lib/api';
import type { Category, PortfolioItem } from '@/shared/lib/content-schema';
import { slugify } from '@/shared/lib/text';
import { MediaUploadForm } from '../components/MediaUploadForm';

type PortfolioBundle = {
  items: PortfolioItem[];
  categories: Category[];
};

const createEmptyItem = (categorySlug = 'events'): PortfolioItem => ({
  id: '',
  title: '',
  slug: '',
  categorySlug,
  description: '',
  longDescription: '',
  mediaType: 'photo',
  src: '',
  thumbnailSrc: '',
  posterSrc: '',
  alt: '',
  featured: false,
  published: true,
  order: 1,
  location: '',
  year: `${new Date().getFullYear()}`,
  aspectRatio: 'portrait',
  tags: [],
});

export function AdminPortfolioPage() {
  const { data, loading, error, reload } = useAsyncData<PortfolioBundle>(async () => {
    const [items, categories] = await Promise.all([
      apiRequest<PortfolioItem[]>('/api/admin/portfolio'),
      apiRequest<Category[]>('/api/admin/categories'),
    ]);

    return { items, categories };
  }, []);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [draft, setDraft] = useState<PortfolioItem>(createEmptyItem());
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (selectedId === 'new') {
      if (!draft.categorySlug && data.categories[0]) {
        setDraft((current) => createEmptyItem(data.categories[0].slug));
      }
      return;
    }

    const selected = data.items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft(selected);
    }
  }, [data, selectedId]);

  if (loading && !data) {
    return <LoadingState label="Loading portfolio editor..." />;
  }

  if (!data || error) {
    return <EmptyState title="Portfolio editor unavailable." body={error ?? 'Try again shortly.'} />;
  }

  const handleSave = async () => {
    const payload = {
      ...draft,
      id: draft.id || undefined,
      slug: draft.slug || undefined,
      order: Number(draft.order),
      tags: draft.tags,
    };

    if (selectedId === 'new') {
      await apiRequest<PortfolioItem[]>('/api/admin/portfolio', {
        method: 'POST',
        body: payload,
      });
      setSelectedId(payload.id ?? `work-${slugify(draft.title)}`);
      setStatus('Portfolio item created.');
    } else {
      await apiRequest<PortfolioItem[]>(`/api/admin/portfolio/${selectedId}`, {
        method: 'PUT',
        body: payload,
      });
      setStatus('Portfolio item updated.');
    }

    await reload();
  };

  const handleDelete = async () => {
    if (selectedId === 'new') {
      setDraft(createEmptyItem(data.categories[0]?.slug ?? 'events'));
      return;
    }

    await apiRequest<PortfolioItem[]>(`/api/admin/portfolio/${selectedId}`, { method: 'DELETE' });
    setSelectedId('new');
    setDraft(createEmptyItem(data.categories[0]?.slug ?? 'events'));
    setStatus('Portfolio item deleted.');
    await reload();
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>Create, publish, feature, and sort portfolio entries.</h2>
        </div>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setSelectedId('new');
            setDraft(createEmptyItem(data.categories[0]?.slug ?? 'events'));
          }}
        >
          New item
        </button>
      </header>

      <div className="admin-grid admin-grid--editor">
        <section className="admin-card">
          <div className="admin-table">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-table__row ${selectedId === item.id ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedId(item.id);
                  setDraft(item);
                }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.categorySlug} / {item.mediaType}
                  </span>
                </div>
                <span>{item.published ? 'Published' : 'Hidden'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-form admin-form--two-columns">
            <MediaUploadForm
              onUploaded={(file) =>
                setDraft((current) => ({
                  ...current,
                  src: file.url,
                  thumbnailSrc:
                    current.mediaType === 'photo' && !current.thumbnailSrc ? file.url : current.thumbnailSrc,
                  posterSrc:
                    current.mediaType === 'photo' && !current.posterSrc ? file.url : current.posterSrc,
                }))
              }
            />

            <label>
              Title
              <input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
            </label>

            <label>
              Slug
              <input
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
                placeholder="Auto-generated if left blank"
              />
            </label>

            <label>
              Category
              <select
                value={draft.categorySlug}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, categorySlug: event.target.value }))
                }
              >
                {data.categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Media type
              <select
                value={draft.mediaType}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    mediaType: event.target.value as PortfolioItem['mediaType'],
                  }))
                }
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </label>

            <label>
              Order
              <input
                type="number"
                value={draft.order}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, order: Number(event.target.value) }))
                }
              />
            </label>

            <label>
              Year
              <input
                value={draft.year}
                onChange={(event) => setDraft((current) => ({ ...current, year: event.target.value }))}
              />
            </label>

            <label>
              Location
              <input
                value={draft.location}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, location: event.target.value }))
                }
              />
            </label>

            <label>
              Aspect ratio
              <select
                value={draft.aspectRatio}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    aspectRatio: event.target.value as PortfolioItem['aspectRatio'],
                  }))
                }
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="square">Square</option>
              </select>
            </label>

            <label className="admin-form__full">
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>

            <label className="admin-form__full">
              Long description
              <textarea
                rows={5}
                value={draft.longDescription}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, longDescription: event.target.value }))
                }
              />
            </label>

            <label className="admin-form__full">
              Media source URL
              <input
                value={draft.src}
                onChange={(event) => setDraft((current) => ({ ...current, src: event.target.value }))}
              />
            </label>

            <label className="admin-form__full">
              Thumbnail URL
              <input
                value={draft.thumbnailSrc}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, thumbnailSrc: event.target.value }))
                }
              />
            </label>

            <label className="admin-form__full">
              Poster URL
              <input
                value={draft.posterSrc}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, posterSrc: event.target.value }))
                }
              />
            </label>

            <label className="admin-form__full">
              Alt text
              <input
                value={draft.alt}
                onChange={(event) => setDraft((current) => ({ ...current, alt: event.target.value }))}
              />
            </label>

            <label className="admin-form__full">
              Tags
              <input
                value={draft.tags.join(', ')}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    tags: event.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="event, portrait, cinematic"
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, featured: event.target.checked }))
                }
              />
              Featured on homepage
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, published: event.target.checked }))
                }
              />
              Visible on public site
            </label>

            <div className="admin-form__actions admin-form__full">
              <button type="button" className="button button--primary" onClick={() => void handleSave()}>
                Save item
              </button>
              <button type="button" className="button button--ghost" onClick={() => void handleDelete()}>
                Delete item
              </button>
            </div>
            {status ? <p className="form-status admin-form__full">{status}</p> : null}
          </div>

          <div className="admin-preview">
            <p className="eyebrow">Preview</p>
            {draft.mediaType === 'video' ? (
              <video src={draft.src} poster={draft.posterSrc} controls />
            ) : (
              <img src={draft.thumbnailSrc || draft.src} alt={draft.alt || draft.title} />
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
