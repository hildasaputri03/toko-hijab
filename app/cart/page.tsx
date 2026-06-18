import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { updateCartQuantity, removeCartItem } from './actions';
import CartItemActions from './CartItemActions';

export const dynamic = 'force-dynamic';


export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { id: 'desc' },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-10 lg:px-8">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">
              Keranjang Belanja
            </h1>
            <span className="text-sm text-slate-500">
              {cartItems.length} item
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                <svg
                  className="h-8 w-8 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="mb-2 text-sm font-medium text-slate-900">
                Keranjang kamu masih kosong
              </p>
              <p className="mb-6 text-xs text-slate-500">
                Yuk mulai belanja dan temukan hijab favoritmu!
              </p>
              <Link
                href="/products"
                className="inline-flex rounded-full bg-gradient-to-r from-red-900 to-rose-700 px-6 py-2.5 text-sm font-semibold text-white hover:from-red-950 hover:to-rose-800"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
              {/* Cart Items */}
              <section className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm font-medium text-slate-900 hover:text-red-800"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          Harga satuan: Rp{' '}
                          {item.product.price.toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <CartItemActions
                          cartItemId={item.id}
                          quantity={item.quantity}
                          updateAction={updateCartQuantity}
                          removeAction={removeCartItem}
                        />

                        <p className="text-sm font-semibold text-red-900">
                          Rp{' '}
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Order Summary */}
              <aside className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-sm font-semibold text-slate-900">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Ongkos Kirim</span>
                    <span>
                      {shipping > 0
                        ? `Rp ${shipping.toLocaleString('id-ID')}`
                        : 'Gratis'}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-base font-semibold text-slate-900">
                      <span>Total</span>
                      <span className="text-red-900">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-900 to-rose-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-red-950 hover:to-rose-800"
                >
                  Lanjut ke Checkout
                </Link>

                <p className="text-center text-[11px] text-slate-400">
                  Harga sudah termasuk PPN. Biaya pengiriman dihitung saat
                  checkout.
                </p>

                <Link
                  href="/products"
                  className="block text-center text-xs font-medium text-red-800 hover:text-red-900"
                >
                 Lanjut Belanja
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
