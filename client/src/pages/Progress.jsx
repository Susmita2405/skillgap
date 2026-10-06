import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProgress,
  updateSkillProgress,
  updateProjectProgress
} from "../services/progressService";

const Progress = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProgress();
      const progressPayload = response?.data || response;
      setData(progressPayload);
    } catch (err) {
      console.error("Load progress error:", err);
      setError(
        err.response?.data?.message || "Unable to load progress"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeSkillProgress = async (skillSlug, value) => {
    try {
      const response = await updateSkillProgress(skillSlug, Number(value));
      const updated = response?.data || response;
      setData(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update skill");
    }
  };

  const changeProjectProgress = async (projectId, value) => {
    try {
      const numericValue = Number(value);
      const status =
        numericValue === 100
          ? "Completed"
          : numericValue > 0
          ? "In Progress"
          : "Not Started";

      const response = await updateProjectProgress(projectId, numericValue, status);
      const updated = response?.data || response;
      setData(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-indigo-300">Loading progress...</p>
        </div>
      </div>
    );
  }

  const progressData = data?.data || data || {};
  const overallProgress = Number(progressData.overallProgress ?? progressData.roadmapPercentage ?? 0);
  const skills = Array.isArray(progressData.skills) ? progressData.skills : [];
  const projects = Array.isArray(progressData.projects) ? progressData.projects : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition mb-2 inline-flex items-center gap-1 font-semibold"
            >
              ← Back to Dashboard
            </button>
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
              YOUR CAREER JOURNEY
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 text-white">
              Career Progress
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/career-roadmap")}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              Roadmap →
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
            >
              Projects →
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* OVERALL PROGRESS CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-7 mb-8 shadow-lg">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Overall Readiness & Progress
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-3">
            <h2 className="text-5xl font-extrabold text-white">
              {overallProgress}%
            </h2>

            <div className="flex-1 w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: `${overallProgress}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* SKILL PROGRESS CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold text-white">
            Skill Progress
          </h2>

          <div className="mt-5 space-y-5">
            {skills.length === 0 ? (
              <p className="text-slate-400 text-sm py-2">
                No specific skill milestones tracked yet. Complete your roadmap modules or add skills in My Skills to track your growth.
              </p>
            ) : (
              skills.map((skill) => (
                <div key={skill.skillSlug} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between mb-2 text-sm font-semibold">
                    <span className="text-slate-200 capitalize">
                      {skill.skillSlug.replace(/-/g, " ")}
                    </span>
                    <span className="text-indigo-400">
                      {skill.progress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.progress}
                    onChange={(e) =>
                      changeSkillProgress(skill.skillSlug, e.target.value)
                    }
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* PROJECT PROGRESS CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white">
            Project Progress
          </h2>

          <div className="mt-5 space-y-6">
            {projects.length === 0 ? (
              <p className="text-slate-400 text-sm py-2">
                No projects being actively tracked yet. Explore recommended projects and submit your GitHub repositories for AI review!
              </p>
            ) : (
              projects.map((item) => (
                <div
                  key={item.project?._id || item._id}
                  className="border border-slate-800 rounded-xl p-5 bg-slate-950/60"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white text-base">
                      {item.project?.title || "Hands-on Project"}
                    </h3>
                    <span className="text-sm font-bold text-indigo-400">
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
                        item.project?._id || item.project,
                        e.target.value
                      )
                    }
                    className="w-full mt-4 accent-indigo-500 cursor-pointer"
                  />

                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Status: <span className="text-indigo-300">{item.status || "In Progress"}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;