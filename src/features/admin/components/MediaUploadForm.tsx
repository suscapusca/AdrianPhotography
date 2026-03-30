import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { apiRequest } from '@/shared/lib/api';

type UploadResponse = {
  filename: string;
  mimeType: string;
  size: number;
  url: string;
};

type MediaUploadFormProps = {
  label?: string;
  accept?: string;
  onUploaded?: (file: UploadResponse) => void;
};

export function MediaUploadForm({
  label = 'Upload media',
  accept = 'image/*,video/*',
  onUploaded,
}: MediaUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setStatus(null);
      const uploaded = await apiRequest<UploadResponse>('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      setStatus(`Uploaded ${uploaded.filename}`);
      onUploaded?.(uploaded);
      event.target.value = '';
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="upload-form">
      <span>{label}</span>
      <input type="file" accept={accept} onChange={handleChange} disabled={isUploading} />
      <strong>{isUploading ? 'Uploading...' : 'Choose file'}</strong>
      {status ? <p>{status}</p> : null}
    </label>
  );
}
