import {
  useNavigate
} from "react-router-dom";

import {
  SearchX
} from "lucide-react";

export default function NotFound() {
  const navigate =
    useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">

      <div className="text-center">

        <SearchX
          size={60}
          className="mx-auto text-blue-400"
        />

        <h1 className="text-7xl font-bold mt-6">
          404
        </h1>

        <h2 className="text-2xl font-semibold mt-3">
          Page not found
        </h2>

        <p className="text-slate-400 mt-3">
          The page you're looking for doesn't exist.
        </p>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="mt-7 bg-blue-600 px-6 py-3 rounded-xl"
        >
          Go to Dashboard
        </button>

      </div>

    </div>
  );
}