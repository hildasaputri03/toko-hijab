'use client';

import { signOut, useSession } from 'next-auth/react';
import { HiOutlineBars3 } from 'react-icons/hi2';

type Props = {
  onMenuClick: () => void;
};

export default function AdminHeader({ onMenuClick }: Props) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 shadow-sm lg:px-8">
      <div className="flex items-center gap-3">
        {/* Hamburger button (mobile only) */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <HiOutlineBars3 className="h-6 w-6 text-slate-700" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Dashboard Admin
          </h1>
          <span className="hidden text-xs text-slate-400 sm:inline">
            Kelola produk & pesanan Shamwari
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {session?.user?.name ?? 'Admin'}
          </p>
          <p className="text-xs text-slate-500">
            {session?.user?.email ?? 'admin@shamwari.com'}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
