import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 px-4 py-10 lg:px-8">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              Hubungi Kami
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Punya pertanyaan tentang produk atau pesanan? Kami siap membantu!
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Form */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Kirim Pesan via WhatsApp
              </h2>
              <p className="mb-6 text-sm text-slate-600">
                Isi form di bawah ini, lalu klik tombol untuk langsung chat
                dengan kami via WhatsApp.
              </p>

              <ContactForm />
            </div>

            {/* Info kontak */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Informasi Kontak
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    shamwari.id@gmail.com
                  </p>
                  <p>
                    <span className="font-medium">WhatsApp:</span> +62 823-3406-2295
                  </p>
                  <p>
                    <span className="font-medium">Jam Operasional:</span> Senin
                    - Sabtu, 09.00 - 17.00 WIB
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-6">
                <h3 className="mb-3 text-sm font-semibold text-emerald-900">
                  Kenapa WhatsApp?
                </h3>
                <ul className="space-y-2 text-xs text-emerald-800">
                  <li>✓ Respon cepat dari tim kami</li>
                  <li>✓ Bisa kirim foto produk yang ditanyakan</li>
                  <li>✓ Chat langsung tanpa perlu registrasi</li>
                  <li>✓ Konfirmasi pesanan lebih mudah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
