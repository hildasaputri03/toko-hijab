import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700';
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Pesanan Saya
          </h1>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-red-800">
            {orders.length} pesanan
          </span>
        </div>

        {orders.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="mb-2 text-sm font-medium text-slate-900">
              Belum ada pesanan
            </p>
            <p className="mb-6 text-xs text-slate-500">
              Yuk mulai belanja dan buat pesanan pertamamu!
            </p>
            <Link
              href="/products"
              className="inline-flex rounded-full bg-gradient-to-r from-red-900 to-rose-700 px-6 py-2.5 text-sm font-semibold text-white hover:from-red-950 hover:to-rose-800"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Order #{order.id.toString().padStart(4, '0')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.createdAt.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-3 border-t border-slate-50 pt-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Item pesanan:
                  </p>
                  <div className="space-y-1">
                    {order.orderItems.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-xs text-slate-700">
                        • {item.product.name} ({item.quantity}x)
                      </p>
                    ))}
                    {order.orderItems.length > 2 && (
                      <p className="text-xs text-slate-400">
                        + {order.orderItems.length - 2} item lainnya
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-xs text-slate-500">Total</span>
                  <span className="text-base font-bold text-red-900">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
