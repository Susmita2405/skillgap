import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  generateSkillGap,
  getLatestSkillGap
} from "../services/skillGapService";

const SkillGap = () => {
  const [searchParams] =
    useSearchParams();

  const role =
    searchParams.get("role") ||
    "backend-developer";

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const latest =
          await getLatestSkillGap();

        if (
          latest.data &&
          latest.data.targetRole === role
        ) {
          setAnalysis(latest.data);
          return;
        }

        const generated =
          await generateSkillGap(role);

        setAnalysis(generated.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to generate skill-gap analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Analyzing your skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Career Analysis
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Your Skill Gap
          </h1>

          <p className="text-gray-500 mt-2">
            Target role:{" "}
            <span className="font-semibold text-gray-800">
              {analysis.targetRole}
            </span>
          </p>
        </div>

        {/* Readiness Score */}

        <div className="bg-white rounded-2xl border shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Career Readiness
              </p>

              <h2 className="text-5xl font-bold mt-2">
                {analysis.readinessScore}%
              </h2>

              <p className="text-gray-500 mt-2">
                Based on your assessed skills
              </p>
            </div>

            <div className="w-full md:w-64">
              <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-700"
                  style={{
                    width: `${analysis.readinessScore}%`
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Summary */}

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Strong
            </p>

            <p className="text-3xl font-bold mt-2">
              {analysis.strongSkills.length}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Moderate
            </p>

            <p className="text-3xl font-bold mt-2">
              {analysis.moderateSkills.length}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Weak
            </p>

            <p className="text-3xl font-bold mt-2">
              {analysis.weakSkills.length}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Missing
            </p>

            <p className="text-3xl font-bold mt-2">
              {analysis.missingSkills.length}
            </p>
          </div>

        </div>

        {/* Skill list */}

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Skill Breakdown
            </h2>
          </div>

          <div className="divide-y">

            {analysis.skills.map(
              (skill) => (
                <div
                  key={skill.skillSlug}
                  className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between"
                >

                  <div>
                    <h3 className="font-semibold">
                      {skill.skillSlug}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {skill.required
                        ? "Required skill"
                        : "Important skill"}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">

                    <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{
                          width: `${skill.studentScore}%`
                        }}
                      />
                    </div>

                    <span className="text-sm font-semibold w-12">
                      {skill.studentScore}%
                    </span>

                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                      {skill.status}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>
        </div>

        {/* Missing Skills */}

        {analysis.missingSkills.length >
          0 && (
          <div className="mt-8 bg-white border rounded-2xl p-6">

            <h2 className="text-xl font-semibold">
              Skills You Need to Learn
            </h2>

            <div className="flex flex-wrap gap-2 mt-4">
              {analysis.missingSkills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full bg-gray-100"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SkillGap;