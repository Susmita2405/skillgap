export default function LoadingState({
  message = "Loading..."
}) {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center">

      <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />

      <p className="text-slate-400 mt-4">
        {message}
      </p>

    </div>
  );
}