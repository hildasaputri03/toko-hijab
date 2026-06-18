'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';

type Props = {
  categories: { id: number; name: string }[];
  action: (formData: FormData) => Promise<void>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')      // buang karakter aneh
    .replace(/\s+/g, '-')             // spasi -> strip
    .replace(/-+/g, '-');             // strip ganda -> satu
}

export default function ProductFormNew({ categories, action }: Props) {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  async function handleAction(formData: FormData) {
    if (!imageUrl) {
      alert('Silakan upload gambar produk dulu');
      return;
    }

    // kalau slug kosong, generate dari name di sisi client juga (fallback)
    const currentSlug = formData.get('slug') as string;
    if (!currentSlug && name) {
      formData.set('slug', slugify(name));
    }

    formData.set('imageUrl', imageUrl);
    await action(formData);
  }

  return (
    <form
      action={handleAction}
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Nama produk
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              // auto-generate slug saat user mengetik nama
              setSlug(slugify(value));
            }}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span>Slug (URL)</span>
            <span className="text-[10px] text-slate-400">
              Bisa diubah manual
            </span>
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="pashmina-premium-silk"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Harga (Rp)
          </label>
          <input
            type="number"
            name="price"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Stok</label>
          <input
            type="number"
            name="stock"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Kategori
          </label>
          <select
            name="categoryId"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Tanpa kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Gambar produk
        </label>

        <ImageUploader
          onUploaded={(url) => {
            setImageUrl(url);
          }}
        />

        <p className="text-xs text-slate-400">
          Gambar akan disimpan di <code>/public/uploads</code>.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <a
          href="/admin/products"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Batal
        </a>
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Simpan Produk
        </button>
      </div>
    </form>
  );
}
