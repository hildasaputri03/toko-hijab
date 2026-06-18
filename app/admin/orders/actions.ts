'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(formData: FormData) {
  const id = Number(formData.get('orderId'));
  const status = formData.get('status') as
    | 'PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'CANCELLED';

  if (!id || !status) return;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/orders');
}

export async function deleteOrder(formData: FormData) {
  const id = Number(formData.get('orderId'));
  if (!id) return;

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({ where: { orderId: id } });
    await tx.bankPayment.deleteMany({ where: { orderId: id } });
    await tx.order.delete({ where: { id } });
  });

  revalidatePath('/admin/orders');
}
