import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import CareerRoadmap from "./pages/CareerRoadmap";
import Dashboard from "./pages/Dashboard.jsx";
import Assessment from "./pages/Assessment.jsx";
import SkillGap from "./pages/SkillGap.jsx";
import Projects from "./pages/Projects.jsx";
import Progress from "./pages/Progress.jsx";
import CareerExplorer from "./pages/CareerExplorer.jsx";
import RoleComparison from "./pages/RoleComparison.jsx";
import Profile from "./pages/Profile.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import LearningResources from "./pages/LearningResources.jsx";
import Analytics from "./pages/Analytics.jsx";
import Activity from "./pages/Activity.jsx";
import SavedItems from "./pages/SavedItems.jsx";
import Skills from "./pages/Skills.jsx";


import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminContent from "./pages/AdminContent.jsx";

import NotFound from "./pages/NotFound.jsx";


function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

        <div className="text-xl font-bold">
          Student
          <span className="text-blue-500">
            Career
          </span>
        </div>

        <div className="flex items-center gap-3">

          <a
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
          >
            Get Started
          </a>

        </div>

      </nav>


      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-6 py-20 lg:px-8">

        <div className="max-w-4xl">

          <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            Student Skill-Gap & Career Planner
          </div>


          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">

            Build the skills your{" "}

            <span className="text-blue-400">
              dream job
            </span>{" "}

            actually requires.

          </h1>


          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">

            Discover your skill gaps, get a personalized
            six-month roadmap, build relevant projects,
            and track your journey toward employability.

          </p>


          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Sign In
            </a>

          </div>


          <div className="mt-16 grid gap-4 sm:grid-cols-3">

            {[
              [
                "01",
                "Choose",
                "Tell us the career you want to pursue."
              ],
              [
                "02",
                "Assess",
                "Understand your current skill level."
              ],
              [
                "03",
                "Improve",
                "Follow a roadmap built around your gaps."
              ]
            ].map((item) => (

              <div
                key={item[0]}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >

                <span className="text-sm font-semibold text-blue-400">
                  {item[0]}
                </span>

                <h3 className="mt-3 font-semibold">
                  {item[1]}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item[2]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}


export default function App() {

  return (

    <Routes>

      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ========================= */}
      {/* PROTECTED APPLICATION */}
      {/* ========================= */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        <Route
  path="/skills"
  element={<Skills />}
/>

<Route
  path="/career-roadmap"
  element={<CareerRoadmap />}
/>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/onboarding"
          element={<Onboarding />}
        />

        <Route
          path="/assessment"
          element={<Assessment />}
        />

        <Route
          path="/skill-gap"
          element={<SkillGap />}
        />

        {/* <Route
          path="/roadmap"
          element={<Roadmap />}
        /> */}

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/careers"
          element={<CareerExplorer />}
        />

        <Route
          path="/role-comparison"
          element={<RoleComparison />}
        />

        <Route
          path="/resources"
          element={<LearningResources />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/activity"
          element={<Activity />}
        />

        <Route
          path="/saved"
          element={<SavedItems />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/content"
          element={<AdminContent />}
        />

      </Route>


      {/* ========================= */}
      {/* 404 */}
      {/* ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );
}