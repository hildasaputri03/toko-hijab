import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import PaymentMethodSelector from '@/app/orders/_components/PaymentMethodSelector';
import OrderReceipt from '@/app/orders/_components/OrderReceipt';

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const orderId = Number(id);

  const user = await getCurrentUser();
  if (!user) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      orderItems: { include: { product: true } },
      bankPayment: true,
    },
  });

  if (!order || !order.bankPayment) notFound();

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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-6">
          <Link
            href="/orders"
            className="mb-3 inline-flex items-center text-sm text-red-800 hover:text-red-900"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Pesanan Saya
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pesanan #{order.id.toString().padStart(4, '0')}
          </h1>
          <p className="text-sm text-slate-500">
            {order.createdAt.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Status Section */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-medium text-slate-900">
            Status pesanan
          </p>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
              order.status,
            )}`}
          >
            {order.status}
          </span>
        </section>

        {/* Payment Methods - Client Component */}
        {order.status === 'PENDING' && (
          <PaymentMethodSelector
            totalAmount={order.totalAmount}
            orderId={order.id}
          />
        )}

        {/* Receipt Component */}
        {(order.status === 'PAID' || order.status === 'SHIPPED') && (
          <OrderReceipt order={order} />
        )}

        {/* Shipping Address Section */}
        <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Alamat Pengiriman
          </p>
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-medium text-slate-900">{order.fullName}</p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.postalCode}
            </p>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Detail Item
          </p>
          <ul className="space-y-3 text-sm">
            {order.orderItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <span className="font-semibold text-red-900">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-slate-900">
              Total Pembayaran
            </span>
            <span className="text-lg font-bold text-red-900">
              Rp {order.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
