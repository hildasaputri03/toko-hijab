import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ProductFormEdit from "@/app/admin/_components/ProductFormEdit";

type Props = {
  params: Promise<{ id: string }>; // <- params sekarang Promise
};

async function updateProduct(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId")
    ? Number(formData.get("categoryId"))
    : null;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      stock,
      imageUrl,
      categoryId: categoryId || undefined,
    },
  });

  redirect("/admin/products");
}

async function deleteProduct(id: number) {
  "use server";

  await prisma.product.delete({
    where: { id },
  });

  redirect("/admin/products");
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <ProductFormEdit
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
        }}
        categories={categories}
        actionUpdate={updateProduct.bind(null, productId)}
        actionDelete={deleteProduct.bind(null, productId)}
      />
    </div>
  );
}
