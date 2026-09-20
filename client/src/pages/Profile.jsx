import { useEffect, useState } from "react";
import {
  User,
  Save,
  Lock
} from "lucide-react";

import {
  getProfile,
  updateProfile,
  changePassword
} from "../services/profileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    targetRole: "",
    education: "",
    bio: ""
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      setProfile(response.data);

      setForm({
        name: response.data.name || "",
        targetRole: response.data.targetRole || "",
        education: response.data.education || "",
        bio: response.data.bio || ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateProfile(form);

      alert("Profile updated successfully");

      await loadProfile();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await changePassword(password);

      alert("Password changed successfully");

      setPassword({
        currentPassword: "",
        newPassword: ""
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to change password"
      );
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <User className="text-blue-400" />

          <div>
            <h1 className="text-3xl font-bold">
              Profile & Settings
            </h1>

            <p className="text-slate-400">
              Manage your career planner profile.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSave}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >

          <h2 className="text-xl font-semibold mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm text-slate-400">
                Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Target Role
              </label>

              <input
                value={form.targetRole}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetRole: e.target.value
                  })
                }
                placeholder="backend-developer"
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3"
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
                placeholder="B.Tech Computer Science"
                className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Email
              </label>

              <input
                value={profile.email}
                disabled
                className="w-full mt-2 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-500"
              />
            </div>

          </div>

          <div className="mt-5">
            <label className="text-sm text-slate-400">
              Bio
            </label>

            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value
                })
              }
              rows="4"
              className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3"
            />
          </div>

          <button
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-xl"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>

        <form
          onSubmit={handlePasswordChange}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6"
        >

          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-red-400" />

            <h2 className="text-xl font-semibold">
              Change Password
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="password"
              placeholder="Current password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  currentPassword: e.target.value
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-xl p-3"
            />

            <input
              type="password"
              placeholder="New password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-xl p-3"
            />

          </div>

          <button className="mt-5 bg-red-600 px-5 py-3 rounded-xl">
            Change Password
          </button>

        </form>

      </div>
    </div>
  );
}