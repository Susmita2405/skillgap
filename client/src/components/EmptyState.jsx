import {
  Inbox
} from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display."
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

      <Inbox
        size={40}
        className="mx-auto text-slate-600"
      />

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        {description}
      </p>

    </div>
  );
}