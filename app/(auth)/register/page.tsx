'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import { registerAction } from './action';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');

    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.success) {
      // Auto login setelah berhasil daftar
      const signInResult = await signIn('credentials', {
        email: result.email,
        password: result.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Berhasil mendaftar, tetapi gagal masuk otomatis. Silakan login manual.');
        setLoading(false);
      } else {
        // Arahkan ke beranda setelah berhasil daftar & login
        router.push('/');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src={logo}
              alt="Shamwari"
              width={80}
              height={80}
              className="mx-auto mb-2 shadow-lg"
            />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Daftar Akun</h1>
          <p className="mt-2 text-sm text-slate-600">
            Buat akun baru untuk mulai belanja
          </p>
        </div>

        {/* Form Card */}
        <form
          action={handleSubmit}
          className="space-y-5 rounded-3xl bg-white p-8 shadow-2xl"
        >
          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nama Lengkap
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="nama@email.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Ketik ulang password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-red-900 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-950 hover:to-rose-800 hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">
                Sudah punya akun?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:border-rose-300 hover:bg-slate-50 hover:text-red-800"
          >
            Masuk di Sini
          </Link>
        </form>

        {/* Back to Home */}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-red-800 hover:text-red-900">
           Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
