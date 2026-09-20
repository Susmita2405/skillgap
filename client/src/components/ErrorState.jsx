import {
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function ErrorState({
  message = "Something went wrong.",
  onRetry
}) {
  return (
    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center">

      <AlertCircle
        size={40}
        className="mx-auto text-red-400"
      />

      <h3 className="font-semibold mt-4">
        Unable to load this page
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}

    </div>
  );
}