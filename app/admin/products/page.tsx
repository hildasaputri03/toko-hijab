import { prisma } from '@/lib/prisma';
import ProductTableWithCategoryModal from '@/app/admin/_components/ProductTableWithCategoryModal';
import { revalidatePath } from 'next/cache';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  async function createCategory(formData: FormData) {
    'use server';

    const rawName = formData.get('name') as string | null;
    const name = rawName?.trim();
    if (!name) return;

    await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
      },
    });

    revalidatePath('/admin/products');
  }

  async function deleteCategory(formData: FormData) {
    'use server';

    const id = Number(formData.get('id'));
    if (!id) return;

    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/products');
  }

  async function deleteProduct(formData: FormData) {
    'use server';

    const id = Number(formData.get('id'));
    if (!id) return;

    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
  }

  return (
    <ProductTableWithCategoryModal
      products={products}
      categories={categories}
      createCategoryAction={createCategory}
      deleteCategoryAction={deleteCategory}
      deleteProductAction={deleteProduct}
    />
  );
}
