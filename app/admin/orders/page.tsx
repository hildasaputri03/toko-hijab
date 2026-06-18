import { prisma } from "@/lib/prisma";
import { updateOrderStatus, deleteOrder } from "./actions";
import DeleteOrderButton from "./DeleteOrderButton";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      bankPayment: true,
    },
    take: 50,
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700";
      case "PAID":
        return "bg-emerald-50 text-emerald-700";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const statuses: Array<"PENDING" | "PAID" | "SHIPPED" | "CANCELLED"> = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Pesanan</h2>
          <p className="text-sm text-slate-500">
            Kelola pesanan masuk dan update status pembayaran.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Order
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Total
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Bank
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="align-top hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    #{o.id.toString().padStart(4, "0")}
                  </p>
                  <p className="text-xs text-slate-500">{o.fullName}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {o.createdAt.toLocaleString("id-ID")}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p className="text-sm">{o.user?.email ?? "-"}</p>
                  <p className="text-xs text-slate-400">ID user: {o.userId}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Rp {o.totalAmount.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {o.bankPayment
                    ? `${o.bankPayment.bankName} • ${o.bankPayment.accountNo}`
                    : "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end gap-2">
                    {/* Ubah status (tetap server action, tanpa onSubmit) */}
                    <form
                      action={updateOrderStatus}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="orderId" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600"
                      >
                        Simpan
                      </button>
                    </form>

                    {/* Hapus order: pakai Client Component */}
                    <DeleteOrderButton orderId={o.id} action={deleteOrder} />
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
