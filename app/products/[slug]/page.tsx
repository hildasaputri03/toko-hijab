import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import AddToCartButton from './AddToCartButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  if (!slug) notFound();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const priceNumber = product.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* breadcrumb */}
        <nav className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-red-800">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-red-800">
            Produk
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gambar */}
          <div className="space-y-4">
            <div className="relative w-full overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={800}
                className="h-[360px] w-full object-cover lg:h-[450px]"
              />
            </div>
            <p className="text-xs text-slate-400">
              Kategori:{' '}
              <span className="font-medium text-slate-700">
                {product.category?.name ?? 'Tanpa kategori'}
              </span>
            </p>
          </div>

          {/* Info produk */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                SKU: #{product.id.toString().padStart(4, '0')}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Harga</p>
                <p className="text-3xl font-bold text-red-900">
                  Rp {priceNumber.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Ketersediaan</p>
                <p className="text-sm font-medium text-slate-800">
                  {product.stock > 0
                    ? `${product.stock} pcs tersedia`
                    : 'Stok habis'}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Deskripsi produk
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                productName={product.name}
              />
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-red-900">
              <p>• Bahan adem dan nyaman dipakai seharian.</p>
              <p>• Cocok untuk aktivitas harian, kerja, dan acara spesial.</p>
              <p>• Garansi tukar ukuran/warna jika barang tidak sesuai.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
