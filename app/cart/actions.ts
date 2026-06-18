'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateCartQuantity(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const cartItemId = Number(formData.get('cartItemId'));
  const action = formData.get('action') as 'increment' | 'decrement';

  if (!cartItemId) return;

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId: user.id },
  });

  if (!cartItem) return;

  const newQuantity =
    action === 'increment'
      ? cartItem.quantity + 1
      : Math.max(1, cartItem.quantity - 1);

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQuantity },
  });

  revalidatePath('/cart');
}

export async function removeCartItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const cartItemId = Number(formData.get('cartItemId'));
  if (!cartItemId) return;

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: user.id },
  });

  revalidatePath('/cart');
}
