import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import hero from '@/assets/herohijab.jpg';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="max-w-lg space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Koleksi{' '}
              <span className="bg-gradient-to-r from-red-900 via-rose-700 to-red-800 bg-clip-text text-transparent">
                Hijab
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">
                Terbaru
              </span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-slate-600 sm:text-xl">
              Hijab premium dengan bahan adem, ringan, dan nyaman dipakai
              sehari-hari. Kualitas terbaik untuk muslimah modern yang aktif.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-900 to-rose-700 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-red-950 hover:to-rose-800 hover:shadow-2xl"
              >
                Belanja Sekarang
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/products#featured"
                className="rounded-2xl border-2 border-slate-200 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-rose-300 hover:bg-slate-50 hover:text-red-800"
              >
                Lihat Koleksi
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                <span className="h-9 w-9 rounded-full border border-white bg-rose-100" />
                <span className="h-9 w-9 rounded-full border border-white bg-red-100" />
                <span className="h-9 w-9 rounded-full border border-white bg-pink-100" />
              </div>
              <p className="text-sm text-slate-500">
                Dipercaya lebih dari{' '}
                <span className="font-semibold text-slate-800">5.000+</span>{' '}
                pelanggan.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 to-red-100 shadow-2xl lg:h-[500px]">
              <Image
                src={hero}
                alt="Model memakai hijab premium"
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 shadow-lg">
                <p className="text-xs font-medium text-slate-500">
                  Koleksi Signature
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Pashmina Premium Silk
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-8 h-48 w-48 rounded-3xl bg-rose-400/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Produk Terpopuler
          </h2>
          <p className="mx-auto max-w-md text-lg text-slate-600">
            Pilihan hijab terbaik yang paling banyak dibeli pelanggan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const priceNumber =
              typeof p.price === 'number' ? p.price : Number(p.price);

            return (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="relative h-80 overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5" />
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="relative">
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">
                      {p.name}
                    </h3>
                    <p className="mb-1 text-xs text-red-800">
                      {p.category?.name ?? 'Tanpa kategori'}
                    </p>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-900">
                        Rp {priceNumber.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {products.length === 0 && (
            <p className="col-span-full text-center text-sm text-slate-500">
              Belum ada produk. Admin bisa menambah produk melalui dashboard.
            </p>
          )}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-all duration-300 hover:border-rose-300 hover:text-red-800 hover:shadow-xl"
          >
            Lihat Semua Produk
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
