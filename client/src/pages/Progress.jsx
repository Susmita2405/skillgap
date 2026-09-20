import { useEffect, useState } from "react";

import {
  getProgress,
  updateSkillProgress,
  updateProjectProgress
} from "../services/progressService";

const Progress = () => {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response =
          await getProgress();

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load progress"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const changeSkillProgress =
    async (
      skillSlug,
      value
    ) => {
      try {
        const response =
          await updateSkillProgress(
            skillSlug,
            Number(value)
          );

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to update skill"
        );
      }
    };

  const changeProjectProgress =
    async (
      projectId,
      value
    ) => {
      try {
        const numericValue =
          Number(value);

        const status =
          numericValue === 100
            ? "Completed"
            : numericValue > 0
            ? "In Progress"
            : "Not Started";

        const response =
          await updateProjectProgress(
            projectId,
            numericValue,
            status
          );

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to update project"
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading progress...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Your Career Journey
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Progress
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white border rounded-2xl p-7 mb-8">

          <p className="text-sm text-gray-500">
            Overall Progress
          </p>

          <div className="flex items-center gap-6 mt-3">

            <h2 className="text-5xl font-bold">
              {data.overallProgress}%
            </h2>

            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black"
                style={{
                  width: `${data.overallProgress}%`
                }}
              />
            </div>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-semibold">
            Skill Progress
          </h2>

          <div className="mt-5 space-y-5">

            {data.skills.length === 0 && (
              <p className="text-gray-500">
                No skill progress recorded yet.
              </p>
            )}

            {data.skills.map(
              (skill) => (
                <div key={skill.skillSlug}>

                  <div className="flex justify-between mb-2">
                    <span>
                      {skill.skillSlug}
                    </span>

                    <span>
                      {skill.progress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.progress}
                    onChange={(e) =>
                      changeSkillProgress(
                        skill.skillSlug,
                        e.target.value
                      )
                    }
                    className="w-full"
                  />

                </div>
              )
            )}

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="text-xl font-semibold">
            Project Progress
          </h2>

          <div className="mt-5 space-y-6">

            {data.projects.length === 0 && (
              <p className="text-gray-500">
                No projects being tracked yet.
              </p>
            )}

            {data.projects.map(
              (item) => (
                <div
                  key={item.project?._id}
                  className="border rounded-xl p-5"
                >

                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {item.project?.title ||
                        "Project"}
                    </h3>

                    <span>
                      {item.progress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={item.progress}
                    onChange={(e) =>
                      changeProjectProgress(
                        item.project._id,
                        e.target.value
                      )
                    }
                    className="w-full mt-4"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    {item.status}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Progress;