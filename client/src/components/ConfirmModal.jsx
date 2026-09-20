export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="text-slate-400 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-7">

          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}