'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  totalAmount: number;
  orderId: number;
};

export default function PaymentMethodSelector({ totalAmount, orderId }: Props) {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg');
  const [paymentUrl, setPaymentUrl] = useState('#');

  useEffect(() => {
    // Generate URL targeting our dummy-pay API
    const url = `${window.location.origin}/api/dummy-pay/${orderId}`;
    setPaymentUrl(url);
    // Use an external API to generate the QR code image for that URL
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`);

    // Poll status every 3 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(totalAmount.toString());
  };

  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Pembayaran QRIS
        </h2>
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Menunggu Pembayaran
        </span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <a 
          href={paymentUrl} 
          target="_blank" 
          rel="noreferrer"
          title="Klik di sini jika ingin mensimulasikan scan di komputer ini"
        >
          <div className="rounded-2xl border-4 border-slate-100 bg-white p-4 shadow-sm relative h-48 w-48 transition-transform hover:scale-105 cursor-pointer">
            {/* Dynamic QR Code Image */}
            <img
              src={qrUrl}
              alt="QRIS Dummy"
              className="h-full w-full object-contain"
            />
          </div>
        </a>
        <div className="text-center">
          <p className="font-bold text-slate-900">QRIS Toko Hijab</p>
          <p className="text-sm text-slate-500">Scan QR code untuk membayar</p>
        </div>
      </div>

      {/* Total Amount - Prominent Display */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Total Pembayaran:
          </span>
          <div className="text-right">
            <span className="block text-2xl font-bold text-red-900">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
            <button
              className="mt-1 text-xs text-red-700 hover:text-red-800"
              onClick={handleCopyAmount}
            >
              Salin nominal
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-amber-50 p-3">
        <p className="text-xs text-amber-800">
          💡 <span className="font-medium">Petunjuk:</span> Scan kode QR di atas
          menggunakan aplikasi M-Banking atau e-Wallet Anda. Kirim bukti
          pembayaran via WhatsApp setelah transfer berhasil.
        </p>
      </div>
    </section>
  );
}
