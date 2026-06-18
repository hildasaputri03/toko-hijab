'use client';

import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';

type Props = {
  cartItemId: number;
  quantity: number;
  updateAction: (formData: FormData) => void;
  removeAction: (formData: FormData) => void;
};

export default function CartItemActions({
  cartItemId,
  quantity,
  updateAction,
  removeAction,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      {/* Quantity controls */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white">
        <form action={updateAction}>
          <input type="hidden" name="cartItemId" value={cartItemId} />
          <input type="hidden" name="action" value="decrement" />
          <button
            type="submit"
            className="p-2 text-slate-600 transition-colors hover:text-emerald-600 disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <HiMinus className="h-4 w-4" />
          </button>
        </form>

        <span className="min-w-[2rem] text-center text-sm font-medium text-slate-900">
          {quantity}
        </span>

        <form action={updateAction}>
          <input type="hidden" name="cartItemId" value={cartItemId} />
          <input type="hidden" name="action" value="increment" />
          <button
            type="submit"
            className="p-2 text-slate-600 transition-colors hover:text-emerald-600"
          >
            <HiPlus className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Remove button */}
      <form
        action={removeAction}
        onSubmit={(e) => {
          if (!confirm('Hapus item dari keranjang?')) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <button
          type="submit"
          className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50"
          title="Hapus item"
        >
          <HiTrash className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
