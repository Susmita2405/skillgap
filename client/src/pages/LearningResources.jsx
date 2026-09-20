import { useEffect, useState } from "react";

import {
  BookOpen,
  ExternalLink,
  Search
} from "lucide-react";

import {
  getResources,
  getRecommendedResources
} from "../services/resourceService";

export default function LearningResources() {
  const [resources, setResources] =
    useState([]);

  const [recommended, setRecommended] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadResources();
  }, [search]);

  useEffect(() => {
    loadRecommended();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);

      const response =
        await getResources({
          search
        });

      setResources(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    try {
      const response =
        await getRecommendedResources();

      setRecommended(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Learning Resources
          </h1>

          <p className="text-slate-400 mt-2">
            Learn the skills needed for your target career.
          </p>
        </div>

        {recommended.length > 0 && (
          <section className="mb-10">

            <h2 className="text-2xl font-bold mb-5">
              Recommended For You
            </h2>

            <div className="space-y-5">

              {recommended.map((group) => (
                <div
                  key={group.skillSlug}
                  className="bg-slate-900 border border-blue-500/20 rounded-2xl p-5"
                >

                  <h3 className="font-semibold text-blue-400 mb-4">
                    {group.skillSlug}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    {group.resources.map(
                      (resource) => (
                        <ResourceCard
                          key={resource._id}
                          resource={resource}
                        />
                      )
                    )}

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        <div className="relative mb-6">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search learning resources..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 pl-11"
          />

        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading resources...
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

function ResourceCard({ resource }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex justify-between">

        <div className="p-3 bg-blue-500/10 rounded-xl">
          <BookOpen
            className="text-blue-400"
            size={22}
          />
        </div>

        <span className="text-xs text-slate-400">
          {resource.type}
        </span>

      </div>

      <h3 className="font-semibold text-lg mt-5">
        {resource.title}
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        {resource.description}
      </p>

      <div className="flex justify-between mt-5 text-xs text-slate-500">
        <span>
          {resource.provider}
        </span>

        <span>
          {resource.estimatedHours} hours
        </span>
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-blue-400"
      >
        Open Resource
        <ExternalLink size={15} />
      </a>

    </div>
  );
}