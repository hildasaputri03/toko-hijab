'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';

type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number | null;
};

type Props = {
  product: Product;
  categories: Category[];
  actionUpdate: (formData: FormData) => Promise<void>;
  actionDelete: () => Promise<void>;
};

export default function ProductFormEdit({
  product,
  categories,
  actionUpdate,
  actionDelete,
}: Props) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  async function handleUpdate(formData: FormData) {
    formData.set('imageUrl', imageUrl);
    await actionUpdate(formData);
  }

  async function handleDelete() {
    const ok = confirm('Yakin hapus produk ini?');
    if (!ok) return;
    await actionDelete();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Edit Produk</h2>
          <p className="text-sm text-slate-500">
            Ubah detail produk hijab kamu.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Hapus Produk
        </button>
      </div>

      <form
        action={handleUpdate}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nama produk
            </label>
            <input
              name="name"
              defaultValue={product.name}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Slug (URL)
            </label>
            <input
              name="slug"
              defaultValue={product.slug}
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
            defaultValue={product.description}
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
              defaultValue={product.price}
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
              defaultValue={product.stock}
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
              defaultValue={product.categoryId ?? ''}
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
            defaultUrl={product.imageUrl}
            onUploaded={(url) => setImageUrl(url)}
          />
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </>
  );
}
