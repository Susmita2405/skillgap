import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  generateSkillGap,
  getLatestSkillGap,
  getSkillGapForRole
} from "../services/skillGapService";

const SkillGap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get("role") || "";
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Skill Gap (from URL role, localStorage role, or latest saved)
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const loadSkillGap = async () => {
      try {
        setLoading(true);
        setError("");

        const activeRole =
          roleParam || localStorage.getItem("targetRole") || "";

        let response;
        if (activeRole) {
          response = await getSkillGapForRole(activeRole);
        } else {
          response = await getLatestSkillGap();
        }

        const freshAnalysis = response?.data;

        if (!freshAnalysis) {
          setError(
            "Please select your target role from the Dashboard first."
          );
          return;
        }

        setAnalysis(freshAnalysis);
      } catch (err) {
        console.error("Skill gap loading error:", err);

        // Fallback to latest
        try {
          const fallback = await getLatestSkillGap();
          if (fallback?.data) {
            setAnalysis(fallback.data);
            return;
          }
        } catch {
          // ignore fallback error
        }

        setError(
          err.response?.data?.message ||
            "Unable to load skill gap analysis. Please select a target role on the Dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkillGap();
  }, [roleParam]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            Analyzing your skill gap...
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Comparing your skills, resume and GitHub with your target role.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border shadow-sm">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const strongList = analysis.strongSkills || [];
  const moderateList = analysis.moderateSkills || [];
  const missingList = analysis.missingSkills || [];
  const readiness = analysis.readinessScore ?? 0;
  const progress = analysis.overallProgress ?? readiness;
  const roleName = analysis.targetRoleName || analysis.targetRole || "Selected Career";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-black font-medium transition"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
            Career Analysis
          </p>
          <h1 className="text-3xl font-bold mt-1 text-gray-900">
            Your Skill Gap
          </h1>
          <p className="text-gray-600 mt-2">
            Target role:{" "}
            <span className="font-semibold text-gray-900">{roleName}</span>
          </p>
        </div>

        {/* Career Readiness & Overall Progress Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Readiness Card */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Status
              </span>
              <p className="text-sm text-gray-500 mt-1">Career Readiness</p>
              <h2 className="text-5xl font-extrabold mt-2 text-gray-900">
                {readiness}%
              </h2>
              <p className="text-gray-500 text-xs mt-2">
                Based on your target role, My Skills, resume and GitHub evidence.
              </p>
            </div>
            <div className="mt-5">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden border">
                <div
                  className="h-full bg-indigo-600 transition-all duration-700"
                  style={{ width: `${Math.min(readiness, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tracked Progress
              </span>
              <p className="text-sm text-gray-500 mt-1">Overall Progress</p>
              <h2 className="text-5xl font-extrabold mt-2 text-gray-900">
                {progress}%
              </h2>
              <p className="text-gray-500 text-xs mt-2">
                Unified alignment across all required competencies.
              </p>
            </div>
            <div className="mt-5">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden border">
                <div
                  className="h-full bg-blue-600 transition-all duration-700"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Three Categories Overview with Lists */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Strong */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-700 font-bold uppercase tracking-wider">
                Strong Skills
              </p>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                {strongList.length}
              </span>
            </div>
            <p className="text-3xl font-extrabold mt-3 text-gray-900">
              {strongList.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Skills you already demonstrate well.
            </p>
            <ul className="mt-4 space-y-1.5 border-t pt-3">
              {strongList.length > 0 ? (
                strongList.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{skill}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400 italic">No strong skills yet</li>
              )}
            </ul>
          </div>

          {/* Moderate */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-700 font-bold uppercase tracking-wider">
                Moderate Skills
              </p>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {moderateList.length}
              </span>
            </div>
            <p className="text-3xl font-extrabold mt-3 text-gray-900">
              {moderateList.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Skills that need more development.
            </p>
            <ul className="mt-4 space-y-1.5 border-t pt-3">
              {moderateList.length > 0 ? (
                moderateList.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <span className="text-amber-500 font-bold">~</span>
                    <span>{skill}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400 italic">No moderate skills</li>
              )}
            </ul>
          </div>

          {/* Missing */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700 font-bold uppercase tracking-wider">
                Missing Skills
              </p>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                {missingList.length}
              </span>
            </div>
            <p className="text-3xl font-extrabold mt-3 text-gray-900">
              {missingList.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Skills required for your target role.
            </p>
            <ul className="mt-4 space-y-1.5 border-t pt-3">
              {missingList.length > 0 ? (
                missingList.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <span className="text-red-400 font-bold">✗</span>
                    <span>{skill}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-400 italic">No missing skills</li>
              )}
            </ul>
          </div>
        </div>

        {/* Detailed Skill Breakdown with Evidence Source Badges */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Skill Breakdown</h2>
            <p className="text-sm text-gray-500 mt-1">
              Clear breakdown showing evidence origin from My Skills, Resume, and GitHub.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {analysis.skills?.map((skill) => (
              <div
                key={skill.skillSlug}
                className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between hover:bg-gray-50/50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {skill.skillName}
                    </h3>
                    {skill.required && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        Required
                      </span>
                    )}
                  </div>

                  {/* Evidence Display (Checkmark if present, Cross if absent) */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                    <span className="text-gray-400 font-medium">Evidence:</span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        skill.evidence?.mySkills
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}
                    >
                      {skill.evidence?.mySkills ? "✓ My Skills" : "✗ My Skills"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        skill.evidence?.resume
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}
                    >
                      {skill.evidence?.resume ? "✓ Resume" : "✗ Resume"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        skill.evidence?.github
                          ? "bg-slate-100 text-slate-800 border border-slate-300"
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}
                    >
                      {skill.evidence?.github ? "✓ GitHub" : "✗ GitHub"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-36 h-2.5 bg-gray-100 rounded-full overflow-hidden border">
                    <div
                      className={`h-full ${
                        skill.status === "Strong"
                          ? "bg-green-600"
                          : skill.status === "Moderate"
                          ? "bg-amber-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${skill.studentScore}%` }}
                    />
                  </div>

                  <span className="text-sm font-bold text-gray-800 w-12 text-right">
                    {skill.studentScore}%
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      skill.status === "Strong"
                        ? "bg-green-100 text-green-800"
                        : skill.status === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills Section */}
        {missingList.length > 0 && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Skills You Need to Learn
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              These skills are required for your target role but are not yet evidenced in your profile.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {missingList.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next step to Roadmap */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md">
          <div>
            <h2 className="text-2xl font-bold">Ready for your roadmap?</h2>
            <p className="text-slate-400 text-sm mt-1">
              Use this skill gap analysis to follow a tailored career roadmap.
            </p>
          </div>
          <button
            onClick={() =>
              navigate(
                `/career-roadmap?role=${encodeURIComponent(
                  analysis.targetRole || roleName
                )}`
              )
            }
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-slate-100 transition whitespace-nowrap"
          >
            Generate Roadmap →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;