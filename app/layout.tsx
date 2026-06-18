import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HijabIndah - Toko Hijab Premium Indonesia",
    template: "%s | HijabIndah",
  },
  description:
    "Koleksi hijab terbaru 2025 dengan bahan premium, adem, dan nyaman. Pashmina, instan, syari, khimar untuk muslimah modern.",
  keywords:
    "hijab, pashmina, hijab instan, syari, toko hijab online, hijab premium",
  authors: [{ name: "HijabIndah" }],
  creator: "HijabIndah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
