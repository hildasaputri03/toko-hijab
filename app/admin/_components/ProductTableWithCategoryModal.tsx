"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: { id: number; name: string } | null;
};

type Category = { id: number; name: string };

type Props = {
  products: Product[];
  categories: Category[];
  createCategoryAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  deleteProductAction: (formData: FormData) => Promise<void>;
};

export default function ProductTableWithCategoryModal({
  products,
  categories,
  createCategoryAction,
  deleteCategoryAction,
  deleteProductAction,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState("");

  async function handleCreateCategory(formData: FormData) {
    formData.set("name", catName.trim());
    if (!catName.trim()) return;
    await createCategoryAction(formData);
    setCatName("");
  }

  async function handleDeleteCategory(id: number) {
    const ok = confirm(
      "Yakin hapus kategori ini? Produk terkait akan kehilangan kategori."
    );
    if (!ok) return;

    const formData = new FormData();
    formData.set("id", String(id));
    await deleteCategoryAction(formData);
  }

  async function handleDeleteProduct(id: number) {
    const ok = confirm("Yakin hapus produk ini?");
    if (!ok) return;

    const formData = new FormData();
    formData.set("id", String(id));
    await deleteProductAction(formData);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Produk</h2>
          <p className="text-sm text-slate-500">
            Kelola katalog hijab di toko kamu.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Kelola Kategori
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            + Produk Baru
          </Link>
        </div>
      </div>

      {/* Tabel Produk */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Produk
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Kategori
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Harga
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Stok
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {p.category?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Rp {p.price.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.stock > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {p.stock} pcs
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  Belum ada produk. Tambahkan produk pertama kamu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Kelola Kategori
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Form tambah kategori */}
            <form action={handleCreateCategory} className="mb-4 flex gap-2">
              <input
                type="text"
                name="name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Nama kategori (mis. Pashmina)"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
              >
                Tambah
              </button>
            </form>

            {/* List kategori */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Hapus
                  </button>
                </div>
              ))}

              {categories.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-400">
                  Belum ada kategori.
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
