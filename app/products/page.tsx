import { ProductService } from '@/lib/services/ProductService';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function ProductsPage() {
  const productService = new ProductService();
  const products = await productService.getLatestProducts(20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Koleksi Hijab Terbaru
            </h1>
            <p className="text-sm text-slate-500">
              Temukan hijab favorit kamu dari berbagai model dan warna.
            </p>
          </div>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-red-800">
            {products.length} produk tersedia
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const priceNumber =
              typeof p.price === 'number' ? p.price : Number(p.price);

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {p.stock <= 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      STOK HABIS
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-red-800">
                    {p.category?.name ?? 'Tanpa kategori'}
                  </p>
                  <p className="line-clamp-1 text-sm font-medium text-slate-900">
                    {p.name}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-red-900">
                      Rp {priceNumber.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {p.stock > 0 ? `${p.stock} pcs` : 'Pre-order'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}

          {products.length === 0 && (
            <p className="col-span-full text-center text-sm text-slate-500">
              Belum ada produk. Admin bisa menambahkan produk melalui dashboard.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
