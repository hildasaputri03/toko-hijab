'use client';

import { SessionProvider } from 'next-auth/react';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
