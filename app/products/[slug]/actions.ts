'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addToCart(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu' };
  }

  const productId = Number(formData.get('productId'));
  const quantity = Number(formData.get('quantity') ?? 1);

  if (!productId || quantity <= 0) {
    return { success: false, message: 'Data produk tidak valid' };
  }

  try {
    const existing = await prisma.cartItem.findFirst({
      where: { userId: user.id, productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath('/cart');
    return { success: true, message: 'Produk berhasil ditambahkan ke keranjang!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambahkan produk' };
  }
}
