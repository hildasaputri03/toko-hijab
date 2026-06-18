import Link from "next/link";
import Image from "next/image";
import logo from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="HijabIndah" width={40} height={40} />
              </Link>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Toko hijab premium dengan koleksi pashmina, instan, dan syari
              untuk muslimah modern. Nyaman dipakai, cantik di setiap momen.
            </p>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} HijabIndah. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/products" className="hover:text-red-800">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-red-800">
                  Keranjang
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-red-800">
                  Pesanan Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Kontak</h3>
            <p className="text-sm text-slate-500">
              WhatsApp: <span className="font-medium">+62 823-3406-2295</span>
              <br />
              Email: <span className="font-medium">shamwari.id@gmail.com</span>
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/shamwari.id"
                target="_blank"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-800 hover:text-white transition-colors"
              >
                {/* IG */}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    ry="5"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="3.5" strokeWidth="2" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@shamwari.id"
                target="_blank"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-800 hover:text-white transition-colors"
              >
                {/* TikTok / generic icon */}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M16 8.5C17 9.5 18.5 10 20 10"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 7v8a3 3 0 1 1-2.5-2.96"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M16 4v4.5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
