'use client';

import { useFormStatus } from 'react-dom';
import { addToCart } from './actions';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { toast } from 'sonner';

type Props = {
  productId: number;
  slug: string;
  productName: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-900 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-red-950 hover:to-rose-800 disabled:opacity-50"
    >
      {pending ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Menambahkan...
        </>
      ) : (
        'Tambah ke Keranjang'
      )}
    </button>
  );
}

export default function AddToCartButton({
  productId,
  slug,
  productName,
}: Props) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await addToCart(formData);

    if (result.success) {
      mutate('/api/cart/count');

      toast.success('Berhasil ditambahkan!', {
        description: `${productName} sudah ada di keranjang kamu`,
        action: {
          label: 'Lihat Keranjang',
          onClick: () => router.push('/cart'),
        },
      });

      router.refresh();
    } else {
      toast.error('Gagal menambahkan', {
        description: result.message || 'Terjadi kesalahan, coba lagi',
      });
    }
  }

  return (
    <form action={handleSubmit} className="flex-1">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton />
    </form>
  );
}
