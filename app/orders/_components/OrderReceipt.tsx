'use client';

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: number;
  fullName: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  orderItems: OrderItem[];
};

export default function OrderReceipt({ order }: { order: Order }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm print:m-0 print:shadow-none print:p-0">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h2 className="text-lg font-semibold text-slate-900">Struk Pembayaran</h2>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          Cetak Struk
        </button>
      </div>

      <div className="mx-auto max-w-sm rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 relative overflow-hidden">
        {/* Lunas Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-10 pointer-events-none">
          <p className="text-6xl font-black uppercase text-emerald-600 border-4 border-emerald-600 rounded-lg p-2">LUNAS</p>
        </div>

        <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">TOKO HIJAB</h3>
          <p className="text-xs text-slate-500 mt-1">Struk Pembelian Resmi</p>
        </div>

        <div className="space-y-2 text-xs text-slate-600 border-b border-dashed border-slate-300 pb-4 mb-4">
          <div className="flex justify-between">
            <span>No. Pesanan:</span>
            <span className="font-medium text-slate-900">#{order.id.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span className="font-medium text-slate-900">
              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-medium text-slate-900">{order.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span>Metode:</span>
            <span className="font-medium text-slate-900">QRIS</span>
          </div>
        </div>

        <div className="space-y-3 border-b border-dashed border-slate-300 pb-4 mb-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="text-xs">
              <p className="font-medium text-slate-900">{item.product.name}</p>
              <div className="flex justify-between text-slate-500 mt-0.5">
                <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                <span className="font-medium text-slate-900">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-900">Total Tagihan</span>
          <span className="font-bold text-emerald-600 text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-400">
          <p>Terima kasih atas pesanan Anda!</p>
          <p>Simpan struk ini sebagai bukti pembayaran yang sah.</p>
        </div>
      </div>
    </div>
  );
}
