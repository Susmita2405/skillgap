import { useEffect, useState } from "react";

import {
  Search,
  Briefcase,
  Code,
  BookOpen,
  FolderKanban
} from "lucide-react";

import {
  globalSearch
} from "../services/searchService";

export default function GlobalSearch() {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(
      search,
      300
    );

    return () =>
      clearTimeout(timer);
  }, [query]);

  const search = async () => {
    try {
      setLoading(true);

      const response =
        await globalSearch(query);

      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total =
    results
      ? results.roles.length +
        results.skills.length +
        results.projects.length +
        results.resources.length
      : 0;

  return (
    <div className="relative w-full max-w-xl">

      <div className="relative">

        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search careers, skills, projects..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pl-11"
        />

      </div>

      {results && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4">

          {loading ? (
            <p className="text-slate-400 p-3">
              Searching...
            </p>
          ) : total === 0 ? (
            <p className="text-slate-400 p-3">
              No results found.
            </p>
          ) : (
            <div className="space-y-5">

              <SearchGroup
                title="Careers"
                icon={Briefcase}
                items={results.roles}
                name="name"
              />

              <SearchGroup
                title="Skills"
                icon={Code}
                items={results.skills}
                name="name"
              />

              <SearchGroup
                title="Projects"
                icon={FolderKanban}
                items={results.projects}
                name="title"
              />

              <SearchGroup
                title="Learning Resources"
                icon={BookOpen}
                items={results.resources}
                name="title"
              />

            </div>
          )}

        </div>
      )}

    </div>
  );
}

function SearchGroup({
  title,
  icon: Icon,
  items,
  name
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div>

      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <Icon size={16} />
        {title}
      </div>

      <div className="space-y-1">

        {items.slice(0, 5).map(
          (item) => (
            <div
              key={item._id}
              className="p-2 rounded-lg hover:bg-slate-800"
            >
              {item[name]}
            </div>
          )
        )}

      </div>

    </div>
  );
}