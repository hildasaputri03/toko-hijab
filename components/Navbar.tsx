'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/logo.jpg';
import { HiOutlineShoppingBag, HiOutlineBars3 } from 'react-icons/hi2';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Produk' },
  { href: '/contact', label: 'Kontak' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isLoadingSession = status === 'loading';

  const { data: cartData } = useSWR<{ count: number }>(
    session ? '/api/cart/count' : null,
    fetcher,
    { refreshInterval: 30000 },
  );

  const cartCount = cartData?.count ?? 0;
  const showBadge = cartCount > 0;

  const initials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'GU';

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="HijabIndah"
            width={40}
            height={40}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-red-800'
                  : 'text-slate-700 hover:text-red-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Auth + Cart */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          {isLoadingSession ? (
            <div className="hidden h-8 w-20 animate-pulse rounded-xl bg-slate-100 sm:block" />
          ) : session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="hidden rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-50 sm:inline-flex"
                >
                  Admin
                </Link>
              )}

              <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-2 py-1 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-800 text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="max-w-[110px] truncate text-xs font-medium text-slate-800">
                  {session.user?.name}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 sm:inline-flex"
              >
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md sm:inline-flex"
            >
              Masuk
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative inline-flex items-center rounded-full p-2 text-slate-700 hover:bg-slate-100"
          >
            <HiOutlineShoppingBag className="h-5 w-5" />
            {showBadge && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex rounded-full p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <HiOutlineBars3 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white pb-3 pt-2 md:hidden">
          <div className="space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {session && (
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive('/orders')
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Pesanan Saya
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive('/admin')
                    ? 'bg-red-50 text-red-700'
                    : 'text-red-700 hover:bg-red-50'
                }`}
              >
                Admin
              </Link>
            )}

            {!isLoadingSession && !session && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
              >
                Masuk
              </Link>
            )}

            {!isLoadingSession && session && (
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
