'use client';

import { useState } from 'react';

type Props = {
  defaultUrl?: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploader({ defaultUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | undefined>(defaultUrl);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const errText = await res.text();
      alert(`Upload gambar gagal: ${errText}`);
      return;
    }

    const data = await res.json();
    setPreview(data.url);
    onUploaded(data.url);
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
      />
      {loading && (
        <p className="text-xs text-slate-500">Mengupload gambar...</p>
      )}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-32 w-32 rounded-xl border border-slate-100 object-cover"
        />
      )}
    </div>
  );
}
