import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  getRecommendations,
  getLatestRecommendations,
  submitProject,
  getUserSubmissions
} from "../services/projectService";

const Projects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get("role");
  const storedRole = localStorage.getItem("targetRole") || "";
  const role = roleParam || storedRole || "Software Developer";

  const [recommendations, setRecommendations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Submission state
  const [activeSubmitProject, setActiveSubmitProject] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [latestReview, setLatestReview] = useState(null);

  useEffect(() => {
    loadProjectsAndSubmissions();
  }, [role]);

  const loadProjectsAndSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      let recs = [];
      try {
        const latest = await getLatestRecommendations();
        if (latest.data?.recommendations?.length > 0) {
          recs = latest.data.recommendations;
        }
      } catch {
        // If no latest cached recommendation, generate fresh
      }

      if (recs.length === 0) {
        const response = await getRecommendations(role);
        recs = response.data?.recommendations || [];
      }

      setRecommendations(recs);

      // Load past submissions
      try {
        const subsRes = await getUserSubmissions();
        setSubmissions(subsRes.data || []);
      } catch (err) {
        console.warn("Could not load submissions:", err?.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load personalized projects. Please try generating."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setGenerating(true);
      setError("");
      const response = await getRecommendations(role);
      setRecommendations(response.data?.recommendations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate project recommendations with Gemini."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setSubmitError("Please enter a valid GitHub repository URL.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");
      setLatestReview(null);

      const payload = {
        projectId: activeSubmitProject?._id || activeSubmitProject?.project?._id,
        projectTitle: activeSubmitProject?.title || activeSubmitProject?.project?.title,
        githubUrl: githubUrl.trim(),
        submissionNotes: submissionNotes.trim()
      };

      const result = await submitProject(payload);
      const submissionData = result.data;

      setLatestReview(submissionData);
      setSubmissions((prev) => [submissionData, ...prev]);
      setGithubUrl("");
      setSubmissionNotes("");
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to review repository. Ensure the repository is public and contains project files."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-indigo-300">
            Analyzing your missing skills with Gemini...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition mb-2 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
              TARGETED TO CLOSE YOUR SKILL GAP
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 text-white">
              Recommended Projects for {role}
            </h1>
            <p className="text-slate-400 mt-1 max-w-2xl text-sm">
              Hands-on projects specifically recommended by Gemini to help you master your missing skills. Submit your GitHub repository for an AI-powered code review and scorecard!
            </p>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 inline-flex items-center gap-2 shrink-0"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Projects...
              </>
            ) : (
              <>⚡ Refresh Recommendations</>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* LATEST REVIEW MODAL / BANNER */}
        {latestReview && (
          <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-emerald-500" />
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  Review Complete
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  Gemini Code Review: {latestReview.projectTitle}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Repo:{" "}
                  <a
                    href={latestReview.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline"
                  >
                    {latestReview.githubUrl}
                  </a>
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30">
                <div className="text-3xl font-extrabold text-indigo-400">
                  {latestReview.review?.score || 0}
                  <span className="text-sm text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-xs text-indigo-300 font-medium mt-0.5">
                  Overall Score
                </div>
              </div>
            </div>

            {/* SUMMARY & READINESS */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-slate-300 text-sm leading-relaxed">
                {latestReview.review?.summary}
              </p>
              <div className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                Readiness: {latestReview.review?.industryReadiness || "Intermediate"}
              </div>
            </div>

            {/* CATEGORIES */}
            {latestReview.review?.categories?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Category Evaluation Breakdown
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {latestReview.review.categories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-white">
                          {cat.name}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            cat.score >= 80
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : cat.score >= 60
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {cat.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${
                            cat.score >= 80
                              ? "bg-emerald-500"
                              : cat.score >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                      {cat.feedback && (
                        <p className="text-xs text-slate-400 leading-normal">
                          {cat.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STRENGTHS & IMPROVEMENTS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {latestReview.review?.strengths?.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
                    Key Strengths
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {latestReview.review.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {latestReview.review?.improvements?.length > 0 && (
                <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20">
                  <h4 className="text-xs uppercase font-bold text-violet-400 tracking-wider mb-2">
                    Actionable Next Improvements
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {latestReview.review.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setLatestReview(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-700"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        )}

        {/* SUBMISSION MODAL / FORM */}
        {activeSubmitProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => {
                  setActiveSubmitProject(null);
                  setSubmitError("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>

              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Submit Project For AI Review
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {activeSubmitProject.title || activeSubmitProject.project?.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Provide your GitHub repository URL. Gemini will review the actual repository code structure, security, architecture, and requirement coverage.
              </p>

              {submitError && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/70 border border-red-500/30 text-xs text-red-300">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/my-project"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Make sure the repository is public so the reviewer can read your source files.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notes / Highlights (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Implemented JWT auth, rate limiting, and custom validation"
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubmitProject(null);
                      setSubmitError("");
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Repository...
                      </>
                    ) : (
                      <>Submit & Get AI Review →</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROJECTS GRID */}
        {recommendations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-lg font-semibold text-white">
              No recommended projects generated yet.
            </h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Click the button below to generate personalized projects for {role} using Gemini.
            </p>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
            >
              {generating ? "Generating..." : "Generate Projects with Gemini"}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => {
              const project = rec.project || rec;
              const missingSkillsList =
                project.targetedMissingSkills?.length > 0
                  ? project.targetedMissingSkills
                  : rec.skillsToLearn || [];

              return (
                <div
                  key={project._id || index}
                  className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {/* TOP BADGES */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {project.difficulty || "Intermediate"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          ⏱ {project.estimatedDuration || `${project.estimatedWeeks || 2} weeks`}
                        </span>
                      </div>

                      {rec.matchScore && (
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {rec.matchScore}% Match
                        </span>
                      )}
                    </div>

                    {/* TITLE & DESCRIPTION */}
                    <h2 className="text-xl font-bold text-white mt-3">
                      {project.title}
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* TARGETED MISSING SKILLS */}
                    {missingSkillsList.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                        <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
                          Targets Missing Skills:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {missingSkillsList.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                            >
                              ○ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* REQUIREMENTS */}
                    {project.requirements?.length > 0 && (
                      <div className="mt-4">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Key Deliverables:
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                          {project.requirements.slice(0, 4).map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* LEARNING OUTCOME */}
                    {project.expectedLearningOutcome && (
                      <p className="text-xs text-slate-400 italic mt-3">
                        <strong>Outcome:</strong> {project.expectedLearningOutcome}
                      </p>
                    )}
                  </div>

                  {/* SUBMISSION ACTION */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setActiveSubmitProject(project);
                        setSubmitError("");
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow transition inline-flex items-center justify-center gap-2"
                    >
                      Submit Project for AI Review →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAST SUBMISSIONS & REVIEWS SECTION */}
        {submissions.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-4">
              Your Project Submissions & Reviews ({submissions.length})
            </h2>
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">
                        {sub.projectTitle}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                        Reviewed
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Repository:{" "}
                      <a
                        href={sub.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 underline"
                      >
                        {sub.githubUrl}
                      </a>{" "}
                      • Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                      {sub.review?.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-indigo-400">
                        {sub.review?.score || 0}/100
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sub.review?.industryReadiness || "Intermediate"}
                      </div>
                    </div>
                    <button
                      onClick={() => setLatestReview(sub)}
                      className="px-3 py-1.5 rounded-lg border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:bg-indigo-950 transition"
                    >
                      View Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;