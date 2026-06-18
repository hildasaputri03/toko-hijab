'use client';

type Props = {
  orderId: number;
  action: (formData: FormData) => void;
};

export default function DeleteOrderButton({ orderId, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            `Hapus order #${orderId.toString().padStart(4, '0')}?`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        className="text-[11px] font-medium text-rose-600 hover:text-rose-700"
      >
        Hapus
      </button>
    </form>
  );
}
