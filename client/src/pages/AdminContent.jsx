import {
  useEffect,
  useState
} from "react";

import {
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";

import {
  getAdminContent,
  createAdminContent,
  deleteAdminContent
} from "../services/adminContentService";

export default function AdminContent() {
  const [type, setType] =
    useState("skill");

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [json, setJson] =
    useState("");

  useEffect(() => {
    load();
  }, [type]);

  const load = async () => {
    try {
      setLoading(true);

      const response =
        await getAdminContent(type);

      setItems(
        response.data || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load content"
      );
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    try {
      const data =
        JSON.parse(json);

      await createAdminContent(
        type,
        data
      );

      setJson("");

      await load();
    } catch (error) {
      alert(
        error instanceof SyntaxError
          ? "Invalid JSON"
          : error.response?.data?.message ||
            "Unable to create content"
      );
    }
  };

  const remove = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this item?"
      );

    if (!confirmed) return;

    try {
      await deleteAdminContent(
        type,
        id
      );

      await load();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">
          Content Management
        </h1>

        <p className="text-slate-400 mt-2">
          Manage the career planner catalog.
        </p>

        <div className="flex gap-3 mt-8">

          {[
            "skill",
            "role",
            "project",
            "resource"
          ].map((value) => (
            <button
              key={value}
              onClick={() =>
                setType(value)
              }
              className={`px-4 py-2 rounded-xl capitalize ${
                type === value
                  ? "bg-blue-600"
                  : "bg-slate-900 border border-slate-800"
              }`}
            >
              {value}
            </button>
          ))}

        </div>

        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <h2 className="font-semibold">
            Add {type}
          </h2>

          <textarea
            value={json}
            onChange={(e) =>
              setJson(e.target.value)
            }
            rows={8}
            placeholder='{"name":"Node.js","slug":"node-js"}'
            className="w-full mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm"
          />

          <button
            onClick={create}
            className="mt-4 flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-xl"
          >
            <Plus size={18} />
            Add
          </button>

        </div>

        <div className="flex justify-between items-center mt-8 mb-4">

          <h2 className="text-xl font-bold">
            Existing {type}s
          </h2>

          <button
            onClick={load}
            className="p-2 bg-slate-900 rounded-xl"
          >
            <RefreshCw size={18} />
          </button>

        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading...
          </p>
        ) : (
          <div className="space-y-3">

            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >

                <div>
                  <p className="font-medium">
                    {item.name ||
                      item.title ||
                      item.description ||
                      item._id}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.slug || item.type || ""}
                  </p>
                </div>

                <button
                  onClick={() =>
                    remove(item._id)
                  }
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}