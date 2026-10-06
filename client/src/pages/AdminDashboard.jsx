import { useEffect, useState } from "react";

import {
  Users,
  Briefcase,
  Code,
  ClipboardCheck,
  Shield
} from "lucide-react";

import { getAdminDashboard } from "../services/adminService";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  // =========================
  // LOAD ADMIN DASHBOARD
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getAdminDashboard();

        console.log(
          "ADMIN DASHBOARD:",
          response.data
        );

        setData(response.data);
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      }
    };

    loadDashboard();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  // =========================
  // STATISTICS
  // =========================

  const stats = [
    {
      title: "Users",
      value: data.statistics?.totalUsers ?? 0,
      icon: Users
    },
    {
      title: "Career Roles",
      value: data.statistics?.totalRoles ?? 0,
      icon: Briefcase
    },
    {
      title: "Projects",
      value: data.statistics?.totalProjects ?? 0,
      icon: Code
    },
    {
      title: "Skills",
      value: data.statistics?.totalSkills ?? 0,
      icon: Code
    },
    {
      title: "Assessments",
      value: data.statistics?.totalAssessments ?? 0,
      icon: ClipboardCheck
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
            ========================= */}

        <div className="flex items-center gap-3 mb-8">

          <Shield className="text-red-400" />

          <div>

            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-slate-400">
              Manage and monitor the career planner platform.
            </p>

          </div>

        </div>


        {/* =========================
            STATISTICS
            ========================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {stats.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >

                <Icon className="text-blue-400" />

                <p className="text-slate-400 text-sm mt-5">
                  {item.title}
                </p>

                <p className="text-3xl font-bold mt-1">
                  {item.value}
                </p>

              </div>
            );

          })}

        </div>


        {/* =========================
            RECENT USERS
            ========================= */}

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-xl font-bold">
              Recent Users
            </h2>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-950">

                <tr>

                  <th className="text-left p-4">
                    Name
                  </th>

                  <th className="text-left p-4">
                    Email
                  </th>

                  <th className="text-left p-4">
                    Target Role
                  </th>

                  <th className="text-left p-4">
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody>

                {(data.recentUsers || []).map(
                  (user) => (

                    <tr
                      key={user._id}
                      className="border-t border-slate-800"
                    >

                      <td className="p-4">
                        {user.name}
                      </td>

                      <td className="p-4 text-slate-400">
                        {user.email}
                      </td>

                      <td className="p-4">
                        {user.targetRole || "Not selected"}
                      </td>

                      <td className="p-4 text-slate-400">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}