
import { useEffect, useState } from "react";

import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import {
  getCareerAnalytics,
  getAnalyticsChartData
} from "../services/analyticsService";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    loadAnalytics();
    loadCharts();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getCareerAnalytics();
      setData(response.data);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  const loadCharts = async () => {
    try {
      const response = await getAnalyticsChartData();
      setCharts(response.data);
    } catch (error) {
      console.error("Charts error:", error);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-blue-400">
            Career intelligence
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Career Analytics
          </h1>

          <p className="text-slate-400 mt-2">
            Understand exactly where you stand and what to improve.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid md:grid-cols-4 gap-5">

          <Metric
            icon={Target}
            title="Readiness"
            value={`${data.readinessScore}%`}
          />

          <Metric
            icon={TrendingUp}
            title="Overall Progress"
            value={`${data.overallProgress}%`}
          />

          <Metric
            icon={CheckCircle}
            title="Strong Skills"
            value={data.skillDistribution.strong}
          />

          <Metric
            icon={AlertTriangle}
            title="Skill Gaps"
            value={
              data.skillDistribution.missing +
              data.skillDistribution.moderate
            }
          />

        </div>

        {/* SKILL LISTS */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* BIGGEST GAPS */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Biggest Skill Gaps
            </h2>

            <div className="mt-5 space-y-4">

              {data.biggestGaps?.map((skill) => (
                <div
                  key={skill.skillSlug}
                  className="flex justify-between items-center bg-slate-950 rounded-xl p-4"
                >
                  <span>
                    {skill.skillSlug}
                  </span>

                  <span className="text-red-400">
                    Gap: {skill.gap || 0}
                  </span>
                </div>
              ))}

            </div>

          </section>

          {/* STRONGEST SKILLS */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Your Strongest Skills
            </h2>

            <div className="mt-5 space-y-4">

              {data.strongestSkills?.map((skill) => (
                <div
                  key={skill.skillSlug}
                  className="flex justify-between bg-slate-950 rounded-xl p-4"
                >
                  <span>
                    {skill.skillSlug}
                  </span>

                  <span className="text-green-400">
                    {skill.studentScore || 0}%
                  </span>
                </div>
              ))}

            </div>

          </section>

        </div>

        {/* RECOMMENDATIONS */}
        <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold">
            What You Should Do Next
          </h2>

          <div className="mt-5 space-y-4">

            {data.recommendations?.map((item, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-4"
              >
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  {item.description}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* CHARTS */}
        {charts && (
          <div className="grid lg:grid-cols-2 gap-6 mt-6">

            {/* PIE CHART */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold">
                Skill Distribution
              </h2>

              <div className="h-80 mt-5">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={charts.distribution || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >

                      {(charts.distribution || []).map(
                        (_, index) => (
                          <Cell key={index} />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* BAR CHART */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold">
                Skill Progress
              </h2>

              <div className="h-80 mt-5">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={charts.skillProgress || []}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis
                      domain={[0, 100]}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="progress"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

          </div>
        )}

      </div>

    </div>
  );
}


/* METRIC COMPONENT */

function Metric({
  icon: Icon,
  title,
  value
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <Icon className="text-blue-400" />

      <p className="text-slate-400 mt-5">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}
