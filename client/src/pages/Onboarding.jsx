import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  GraduationCap,
  Target
} from "lucide-react";

import {
  getOnboardingData,
  completeOnboarding
} from "../services/onboardingService";

export default function Onboarding() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);

  const [form, setForm] = useState({
    name: "",
    education: "",
    targetRole: "",
    experienceLevel: "beginner",
    currentSkills: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response =
        await getOnboardingData();

      setRoles(response.data.roles || []);
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (slug) => {
    setForm((previous) => {
      const exists =
        previous.currentSkills.includes(slug);

      return {
        ...previous,
        currentSkills: exists
          ? previous.currentSkills.filter(
              (skill) => skill !== slug
            )
          : [
              ...previous.currentSkills,
              slug
            ]
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.targetRole) {
      alert("Please select your target career");
      return;
    }

    try {
      setSaving(true);

      await completeOnboarding(form);

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to complete onboarding"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading onboarding...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">

          <div className="inline-flex p-4 rounded-2xl bg-blue-500/10">
            <Target
              size={35}
              className="text-blue-400"
            />
          </div>

          <h1 className="text-4xl font-bold mt-5">
            Build Your Career Plan
          </h1>

          <p className="text-slate-400 mt-3">
            Tell us where you are and where you want to go.
          </p>

        </div>

        <form
          onSubmit={submit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-7"
        >

          <div>
            <label className="text-sm text-slate-400">
              Your Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Education
            </label>

            <input
              value={form.education}
              onChange={(e) =>
                setForm({
                  ...form,
                  education: e.target.value
                })
              }
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              placeholder="B.Tech Computer Science"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Target Career
            </label>

            <select
              value={form.targetRole}
              onChange={(e) =>
                setForm({
                  ...form,
                  targetRole: e.target.value
                })
              }
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
            >
              <option value="">
                Select a career
              </option>

              {roles.map((role) => (
                <option
                  key={role._id}
                  value={role.slug}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>

            <label className="text-sm text-slate-400">
              Current Experience
            </label>

            <div className="grid grid-cols-3 gap-3 mt-3">

              {[
                "beginner",
                "intermediate",
                "advanced"
              ].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() =>
                    setForm({
                      ...form,
                      experienceLevel: level
                    })
                  }
                  className={`p-3 rounded-xl border capitalize ${
                    form.experienceLevel === level
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  {level}
                </button>
              ))}

            </div>

          </div>

          <div>

            <div className="flex items-center gap-2">
              <GraduationCap
                size={20}
                className="text-blue-400"
              />

              <label className="text-sm text-slate-400">
                Skills You Already Know
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              {skills.map((skill) => {
                const selected =
                  form.currentSkills.includes(
                    skill.slug
                  );

                return (
                  <button
                    type="button"
                    key={skill._id}
                    onClick={() =>
                      toggleSkill(skill.slug)
                    }
                    className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                      selected
                        ? "bg-blue-600 border-blue-500"
                        : "bg-slate-950 border-slate-800"
                    }`}
                  >
                    {selected && (
                      <Check size={14} />
                    )}

                    {skill.name}
                  </button>
                );
              })}

            </div>

          </div>

          <button
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl p-4 font-semibold flex justify-center items-center gap-2"
          >
            {saving
              ? "Saving..."
              : "Complete My Career Setup"}

            <ArrowRight size={18} />
          </button>

        </form>

      </div>

    </div>
  );
}