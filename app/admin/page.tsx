import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const [productCount, orderCount, pendingOrderCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = revenue._sum.totalAmount ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Total Produk</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {productCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Total Pesanan</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {orderCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Pesanan Pending</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">
            {pendingOrderCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}
