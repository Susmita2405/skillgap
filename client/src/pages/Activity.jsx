import { useEffect, useState } from "react";

import {
  Activity as ActivityIcon,
  CheckCircle,
  Target,
  Map,
  FolderKanban,
  User,
  TrendingUp,
  BookOpen
} from "lucide-react";

import {
  getActivities
} from "../services/activityService";

const iconMap = {
  assessment: CheckCircle,
  skill_gap: Target,
  roadmap: Map,
  project: FolderKanban,
  progress: TrendingUp,
  profile: User,
  resource: BookOpen,
  system: ActivityIcon
};

export default function Activity() {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response =
        await getActivities();

      setActivities(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p className="text-blue-400">
            Your journey
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Activity History
          </h1>

          <p className="text-slate-400 mt-2">
            See everything you have accomplished.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading activity...
          </p>
        ) : activities.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <ActivityIcon
              className="mx-auto text-slate-500"
              size={40}
            />

            <p className="text-slate-400 mt-4">
              No activity yet.
            </p>
          </div>
        ) : (
          <div className="relative">

            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800" />

            <div className="space-y-6">

              {activities.map((activity) => {
                const Icon =
                  iconMap[activity.type] ||
                  ActivityIcon;

                return (
                  <div
                    key={activity._id}
                    className="relative flex gap-5"
                  >

                    <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Icon
                        size={19}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5">

                      <div className="flex justify-between gap-4">

                        <h3 className="font-semibold">
                          {activity.title}
                        </h3>

                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(
                            activity.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <p className="text-slate-400 text-sm mt-2">
                        {activity.description}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}