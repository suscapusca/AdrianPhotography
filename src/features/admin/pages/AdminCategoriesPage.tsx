import { useEffect, useState } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { apiRequest } from '@/shared/lib/api';
import type { Category } from '@/shared/lib/content-schema';

type CategoryDraft = Category;

const createEmptyCategory = (): CategoryDraft => ({
  id: '',
  name: '',
  slug: '',
  description: '',
  visible: true,
  order: 1,
  accent: '',
});

export function AdminCategoriesPage() {
  const { data, loading, error, reload } = useAsyncData<Category[]>(
    () => apiRequest<Category[]>('/api/admin/categories'),
    [],
  );
  const [draft, setDraft] = useState<CategoryDraft>(createEmptyCategory());
  const [selectedId, setSelectedId] = useState<string>('new');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    if (selectedId === 'new') {
      return;
    }

    const selected = data.find((item) => item.id === selectedId);
    if (selected) {
      setDraft(selected);
    }
  }, [data, selectedId]);

  if (loading && !data) {
    return <LoadingState label="Loading categories..." />;
  }

  if (!data || error) {
    return <EmptyState title="Categories unavailable." body={error ?? 'Try again shortly.'} />;
  }

  const handleSave = async () => {
    setStatus(null);

    const payload = {
      ...draft,
      order: Number(draft.order),
    };

    if (selectedId === 'new') {
      await apiRequest<Category[]>('/api/admin/categories', { method: 'POST', body: payload });
      setStatus('Category created.');
    } else {
      await apiRequest<Category[]>(`/api/admin/categories/${selectedId}`, {
        method: 'PUT',
        body: payload,
      });
      setStatus('Category updated.');
    }

    await reload();
  };

  const handleDelete = async () => {
    if (selectedId === 'new') {
      setDraft(createEmptyCategory());
      return;
    }

    await apiRequest<Category[]>(`/api/admin/categories/${selectedId}`, { method: 'DELETE' });
    setSelectedId('new');
    setDraft(createEmptyCategory());
    setStatus('Category deleted.');
    await reload();
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow">Categories</p>
          <h2>Control category names, order, and visibility.</h2>
        </div>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setSelectedId('new');
            setDraft(createEmptyCategory());
          }}
        >
          New category
        </button>
      </header>

      <div className="admin-grid admin-grid--editor">
        <section className="admin-card">
          <div className="admin-table">
            {data.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`admin-table__row ${selectedId === category.id ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedId(category.id);
                  setDraft(category);
                }}
              >
                <div>
                  <strong>{category.name}</strong>
                  <span>{category.slug}</span>
                </div>
                <span>{category.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-form">
            <label>
              Name
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
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
              Accent
              <input
                value={draft.accent}
                onChange={(event) => setDraft((current) => ({ ...current, accent: event.target.value }))}
              />
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
              Description
              <textarea
                rows={5}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(event) => setDraft((current) => ({ ...current, visible: event.target.checked }))}
              />
              Visible on public site
            </label>

            <div className="admin-form__actions">
              <button type="button" className="button button--primary" onClick={() => void handleSave()}>
                Save category
              </button>
              <button type="button" className="button button--ghost" onClick={() => void handleDelete()}>
                Delete category
              </button>
            </div>
            {status ? <p className="form-status">{status}</p> : null}
          </div>
        </section>
      </div>
    </section>
  );
}
