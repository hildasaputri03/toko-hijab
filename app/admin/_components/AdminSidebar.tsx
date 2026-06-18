'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import { HiX } from "react-icons/hi";

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Produk', icon: '🧕' },
  { href: '/admin/orders', label: 'Pesanan', icon: '📦' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-100 bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <Image src={logo} alt="Logo Shamwari" className="h-8 w-8 rounded-full" />
            <span className="text-sm font-bold text-slate-900">
              Admin Dashboard
            </span>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100 lg:hidden"
          >
            <HiX className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 px-4 py-6 text-sm">
          {/* User info */}
          <div className="rounded-2xl bg-rose-50 px-4 py-3">
            <p className="text-xs text-red-800/80">Masuk sebagai</p>
            <p className="text-sm font-semibold text-red-900">
              {session?.user?.name ?? 'Admin'}
            </p>
            <p className="mt-1 text-[11px] text-red-800/80">
              Role:{' '}
              <span className="font-semibold">
                {session?.user?.role ?? 'ADMIN'}
              </span>
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gradient-to-r from-red-900 to-rose-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to site link */}
          <Link
            href="/"
            onClick={onClose}
            className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <span>Kembali ke Toko</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
