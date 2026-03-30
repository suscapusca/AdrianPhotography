import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { apiRequest } from '@/shared/lib/api';
import { MediaUploadForm } from '../components/MediaUploadForm';

type UploadedFile = {
  filename: string;
  url: string;
  size: number;
  updatedAt: string;
};

export function AdminMediaPage() {
  const { data, loading, error, reload } = useAsyncData<UploadedFile[]>(
    () => apiRequest<UploadedFile[]>('/api/admin/uploads'),
    [],
  );

  if (loading && !data) {
    return <LoadingState label="Loading uploads..." />;
  }

  if (!data || error) {
    return <EmptyState title="Uploads unavailable." body={error ?? 'Please refresh the page.'} />;
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow">Media</p>
          <h2>Upload images and videos for hero content, portfolio entries, and thumbnails.</h2>
        </div>
      </header>

      <div className="admin-grid admin-grid--editor">
        <section className="admin-card">
          <MediaUploadForm onUploaded={() => void reload()} />
          <p className="admin-hint">
            Uploaded files are served from <code>/uploads/...</code> and can be pasted into any
            media field in the admin.
          </p>
        </section>

        <section className="admin-card">
          <div className="admin-list-grid">
            {data.map((file) => (
              <article key={file.filename} className="admin-upload-card">
                {/\.(mp4|webm|mov)$/i.test(file.filename) ? (
                  <video src={file.url} controls />
                ) : (
                  <img src={file.url} alt={file.filename} loading="lazy" />
                )}
                <div>
                  <strong>{file.filename}</strong>
                  <input readOnly value={file.url} onFocus={(event) => event.currentTarget.select()} />
                  <span>{new Date(file.updatedAt).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
