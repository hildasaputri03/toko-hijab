'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string).toLowerCase();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Password tidak cocok' };
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email sudah terdaftar' };
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role: 'CUSTOMER',
    },
  });

  return { success: true, email, password };
}
