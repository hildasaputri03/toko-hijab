import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  
  try {
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: 'PAID' },
    });

    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #f0fdf4; color: #166534;">
          <div style="max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <svg style="width: 64px; height: 64px; margin: 0 auto 20px; color: #22c55e;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 style="margin-top: 0;">Pembayaran Berhasil!</h1>
            <p>Pesanan #${orderId} telah lunas. Anda bisa menutup halaman ini dan mengecek status di komputer Anda.</p>
            <button onclick="window.close()" style="margin-top: 20px; background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Tutup Halaman</button>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    return new NextResponse('Failed to update order', { status: 500 });
  }
}
