import { useEffect, useState } from "react";
import {
  Search,
  Briefcase,
  Code,
  ChevronRight
} from "lucide-react";

import {
  getCareers,
  getCareerCategories
} from "../services/careerService";



export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCareers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  const loadCategories = async () => {
    try {
      const result = await getCareerCategories();
      setCategories(result.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCareers = async () => {
    try {
      setLoading(true);

      const result = await getCareers({
        search,
        category
      });

      setCareers(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-blue-400 font-medium">
            Explore your options
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Career Explorer
          </h1>

          <p className="text-slate-400 mt-2">
            Discover career paths and understand what skills they require.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading careers...
          </div>
        ) : careers.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto mb-4 text-slate-500" size={40} />
            <p className="text-slate-400">
              No career roles found.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {careers.map((career) => (
              <div
                key={career._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between">

                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Code className="text-blue-400" />
                  </div>

                  <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">
                    {career.category}
                  </span>

                </div>

                <h2 className="text-xl font-semibold mt-5">
                  {career.name}
                </h2>

                <p className="text-slate-400 text-sm mt-2 line-clamp-3">
                  {career.description || "Career path in technology."}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-slate-500">
                    {career.skills?.length || 0} skills
                  </span>

                  <button className="flex items-center gap-1 text-blue-400">
                    Explore
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}