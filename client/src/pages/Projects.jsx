import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getRecommendations
} from "../services/projectService";

const Projects = () => {
  const [searchParams] =
    useSearchParams();

  const role =
    searchParams.get("role") ||
    "backend-developer";

  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response =
          await getRecommendations(
            role
          );

        setRecommendations(
          response.data
            ?.recommendations || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Finding the best projects for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Personalized Projects
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Projects For You
          </h1>

          <p className="text-gray-500 mt-2">
            Projects selected according to
            your skill gaps and target role.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {recommendations.map(
            (recommendation) => {
              const project =
                recommendation.project;

              return (
                <div
                  key={project._id}
                  className="bg-white border rounded-2xl p-6"
                >

                  <div className="flex justify-between gap-4">

                    <h2 className="text-xl font-semibold">
                      {project.title}
                    </h2>

                    <span className="text-sm font-semibold">
                      {recommendation.matchScore}%
                    </span>

                  </div>

                  <p className="text-gray-500 mt-3">
                    {project.description}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {project.difficulty}
                    </span>

                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {project.estimatedWeeks}{" "}
                      weeks
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="text-sm px-3 py-1 border rounded-full"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {recommendation.skillsToLearn
                    ?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold">
                        Skills you'll improve
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {recommendation.skillsToLearn.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="text-sm px-3 py-1 bg-gray-100 rounded-full"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </div>
    </div>
  );
};

export default Projects;