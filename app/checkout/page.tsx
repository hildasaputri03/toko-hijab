import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

async function createOrder(formData: FormData) {
  'use server';

  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const postalCode = formData.get('postalCode') as string;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) return;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        totalAmount,
        fullName,
        phone,
        address,
        city,
        postalCode,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await tx.bankPayment.create({
      data: {
        orderId: createdOrder.id,
        bankName: 'QRIS',
        accountName: 'Toko Hijab',
        accountNo: 'QRIS',
        note: `Silakan scan QRIS untuk membayar pesanan #${createdOrder.id}`,
      },
    });

    await tx.cartItem.deleteMany({ where: { userId: user.id } });

    return createdOrder;
  });

  redirect(`/orders/${order.id}`);
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">
          Checkout
        </h1>
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <form
            action={createOrder}
            className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Nama lengkap
              </label>
              <input
                name="fullName"
                defaultValue={user.name ?? ''}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                No. HP
              </label>
              <input
                name="phone"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Alamat lengkap
              </label>
              <textarea
                name="address"
                required
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Kota/Kabupaten
                </label>
                <input
                  name="city"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Kode pos
                </label>
                <input
                  name="postalCode"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            {/* Metode pembayaran */}
            <div className="rounded-xl bg-rose-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Metode pembayaran</p>
              <p>
                QRIS (kode QR akan ditampilkan setelah order dibuat).
              </p>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-red-900 to-rose-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-red-950 hover:to-rose-800"
            >
              Buat Pesanan
            </button>
          </form>

          <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">
              Ringkasan pesanan
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    Rp{' '}
                    {(item.product.price * item.quantity).toLocaleString(
                      'id-ID',
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-900">
              <span>Total</span>
              <span className="text-red-900">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
