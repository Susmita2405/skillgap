import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  X
} from "lucide-react";

import { getCareers } from "../services/careerService";
import { compareRoles } from "../services/roleComparisonService";

export default function RoleComparison() {
  const [roles, setRoles] = useState([]);
  const [role1, setRole1] = useState("");
  const [role2, setRole2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await getCareers();
      setRoles(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompare = async () => {
    if (!role1 || !role2) {
      alert("Please select both roles");
      return;
    }

    try {
      setLoading(true);

      const response = await compareRoles(role1, role2);

      setResult(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to compare roles"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="text-blue-400" />

            <h1 className="text-4xl font-bold">
              Role Comparison
            </h1>
          </div>

          <p className="text-slate-400 mt-2">
            Compare the skills required for two career paths.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <select
            value={role1}
            onChange={(e) => setRole1(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <option value="">Select first role</option>

            {roles.map((role) => (
              <option key={role._id} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>

          <select
            value={role2}
            onChange={(e) => setRole2(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <option value="">Select second role</option>

            {roles.map((role) => (
              <option key={role._id} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>

        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="mt-5 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare Roles"}
        </button>

        {result && (
          <div className="mt-10">

            <div className="grid md:grid-cols-2 gap-5">

              {result.roles.map((role) => (
                <div
                  key={role._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold">
                    {role.name}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {role.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {(role.skills || []).map((skill) => (
                      <div
                        key={skill}
                        className="flex gap-3 items-center"
                      >
                        <Check
                          size={18}
                          className="text-green-400"
                        />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                Skill Differences
              </h2>

              <div className="grid md:grid-cols-3 gap-6">

                <div>
                  <h3 className="font-semibold text-green-400">
                    Common Skills
                  </h3>

                  {result.commonSkills.map((skill) => (
                    <p key={skill} className="text-slate-300 mt-2">
                      <Check size={15} className="inline mr-2" />
                      {skill}
                    </p>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold">
                    Only First Role
                  </h3>

                  {result.onlyFirst.map((skill) => (
                    <p key={skill} className="text-slate-300 mt-2">
                      <X size={15} className="inline mr-2" />
                      {skill}
                    </p>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold">
                    Only Second Role
                  </h3>

                  {result.onlySecond.map((skill) => (
                    <p key={skill} className="text-slate-300 mt-2">
                      <X size={15} className="inline mr-2" />
                      {skill}
                    </p>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}