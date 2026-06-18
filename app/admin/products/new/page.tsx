import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductFormNew from '@/app/admin/_components/ProductFormNew';

async function createProduct(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const imageUrl = formData.get('imageUrl') as string;
  const categoryId = formData.get('categoryId')
    ? Number(formData.get('categoryId'))
    : null;

  let uniqueSlug = slug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  await prisma.product.create({
    data: {
      name,
      slug: uniqueSlug,
      description,
      price,
      stock,
      imageUrl,
      categoryId: categoryId || undefined,
    },
  });

  redirect('/admin/products');
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Produk Baru</h2>
        <p className="text-sm text-slate-500">
          Tambahkan produk hijab baru ke katalog.
        </p>
      </div>

      <ProductFormNew categories={categories} action={createProduct} />
    </div>
  );
}
