import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardService";
import "./Dashboard.css";
import api from "../services/api";


const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // TARGET ROLE STATE
  // =========================

const [targetRole, setTargetRole] = useState(
  localStorage.getItem("targetRole") || ""
);
  const [roles, setRoles] = useState([]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [savingRole, setSavingRole] = useState(false);

  // =========================
  // CUSTOM ROLE STATE
  // =========================

  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRole, setCustomRole] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Get dashboard
        const response = await getDashboard();

        setDashboard(response.data);

        // Get current target role
        const currentRole =
          response.data?.user?.targetRole;

        setTargetRole(
          currentRole?.name ||
            currentRole?.title ||
            currentRole?.slug ||
            ""
        );

        // Get available career roles
        const rolesResponse =
          await api.get("/careers");

        const careers =
  rolesResponse.data?.data ||
  rolesResponse.data?.careers ||
  [];

console.log(
  "FINAL CAREERS ARRAY:",
  JSON.stringify(careers, null, 2)
);

setRoles(careers);
        console.log(
  "CAREERS FROM BACKEND:",
  JSON.stringify(rolesResponse.data, null, 2)
);
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =========================
  // SELECT EXISTING ROLE
  // =========================

const handleRoleSelect = async (role) => {
  if (!role?._id) {
    setError("Invalid target role selected.");
    return;
  }

  try {
    setSavingRole(true);
    setError("");

    await api.put("/auth/target-role", {
      targetRole: role._id,
    });

    const selectedRole =
      role.name ||
      role.title ||
      role.slug ||
      "";

    console.log("SELECTED ROLE:", selectedRole);
    console.log("ROLE OBJECT:", role);

    setTargetRole(selectedRole);

    localStorage.setItem(
      "targetRole",
      selectedRole
    );

    setShowCustomRole(false);
    setCustomRole("");
    setShowRoleMenu(false);

  } catch (err) {
    console.error(
      "Failed to update target role:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Unable to update target role"
    );
  } finally {
    setSavingRole(false);
  }
};

  // =========================
  // SAVE CUSTOM ROLE
  // =========================

  const handleCustomRoleSave = async () => {
    const cleanedRole =
      customRole.trim();

    if (!cleanedRole) {
      setError(
        "Please enter your career name."
      );
      return;
    }

    try {
      setSavingRole(true);
      setError("");

      /*
       * This endpoint will create/find the
       * custom Role in the backend and then
       * save it to the current user.
       */
      const response =
        await api.put(
          "/auth/custom-target-role",
          {
            customRole: cleanedRole,
          }
        );

      const savedRole =
        response.data?.user?.targetRole ||
        response.data?.role;

      const selectedRole =
  savedRole?.name ||
  cleanedRole;
  

setTargetRole(selectedRole);

localStorage.setItem(
  "targetRole",
  selectedRole
);

setShowCustomRole(false);
setCustomRole("");
setShowRoleMenu(false);
    } catch (err) {
      console.error(
        "Failed to save custom role:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save your career"
      );
    } finally {
      setSavingRole(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="state-loader">

          <div className="loader-ring"></div>

          <p>
            Loading your career dashboard...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="dashboard-state">

        <div className="state-card">

          <div className="state-icon error-icon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            className="state-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  // =========================
  // DASHBOARD DATA
  // =========================

  const user = dashboard.user;

  const skillGap =
    dashboard.skillGap || {};

  const roadmap =
    dashboard.roadmap;

  const progress =
    dashboard.progress || {};

  const recommendations =
    dashboard.recommendations
      ?.recommendations || [];

  // =========================
  // METRICS
  // =========================

  const readinessScore =
    skillGap?.readinessScore ?? 0;

  const overallProgress =
    progress?.overallProgress ?? 0;

  const roadmapProgress =
    progress?.roadmapProgress ?? 0;

  const strongSkills =
    skillGap?.strongSkills || [];

  const moderateSkills =
    skillGap?.moderateSkills || [];

  const missingSkills =
    skillGap?.missingSkills || [];

  // =========================
  // ROLE SLUG
  // =========================

  const targetRoleSlug =
    user?.targetRole?.slug || "";

  // =========================
  // HELPERS
  // =========================

  const getReadinessLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Getting there";

    return "Needs attention";
  };

  const getProgressLabel = (score) => {
    if (score >= 80) return "Almost there";
    if (score >= 50) return "Great progress";
    if (score > 0) return "Keep going";

    return "Just getting started";
  };

  // =========================
  // NORMAL ROLES
  // =========================

  const defaultRoleNames = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard-page">

      {/* ==================================================
          AMBIENT BACKGROUND
          ================================================== */}

      <div className="dashboard-background">

        <div className="ambient-orb orb-purple"></div>

        <div className="ambient-orb orb-blue"></div>

        <div className="ambient-orb orb-cyan"></div>

        <div className="dashboard-grid-bg"></div>

      </div>


      {/* ==================================================
          MAIN CONTAINER
          ================================================== */}

      <main className="dashboard-container">


        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="dashboard-header">

          <div className="header-left">

            <div className="dashboard-eyebrow">

              <span className="eyebrow-dot"></span>

              STUDENT CAREER COMMAND CENTER

            </div>


            <h1 className="dashboard-title">

              Welcome back ,

              <span className="title-name">

                {user?.name
                  ? ` ${user.name}`
                  : ""}

              </span>

            </h1>


            <p className="dashboard-subtitle">

              Track your skills, build your roadmap,
              and move closer to your dream career.

            </p>

          </div>


          {/* ==================================================
              HEADER ACTIONS
              ================================================== */}

          <div className="header-actions">


            {/* ==================================================
                TARGET ROLE
                ================================================== */}

            <div className="target-role-wrapper">

              <button
                type="button"
                className="role-pill role-pill-clickable"
                onClick={() => {

                  setShowRoleMenu(
                    !showRoleMenu
                  );

                  setShowCustomRole(false);

                }}
                disabled={savingRole}
              >

                <span className="role-pill-label">
                  TARGET ROLE
                </span>


                <span className="role-pill-value">

                  {targetRole ||
                    "Choose role"}

                  <span className="role-chevron">

                    {showRoleMenu
                      ? "▲"
                      : "▼"}

                  </span>

                </span>

              </button>


              {/* ==================================================
                  ROLE MENU
                  ================================================== */}

              {showRoleMenu && (

                <div className="target-role-menu">


                  <div className="target-role-menu-title">

                    Choose your career

                  </div>


                  {/* ==================================================
                      NORMAL ROLES
                      ================================================== */}

                  {defaultRoleNames.map(
                    (roleName) => {

                      const role =
                        roles.find(
                          (item) =>
                            item.name ===
                            roleName
                        );

                      return (

                        <button
                          key={roleName}
                          type="button"
                          className={`target-role-option ${
                            targetRole ===
                            roleName
                              ? "active"
                              : ""
                          }`}
                         onClick={(e) => {
  e.preventDefault();

  if (role) {
    handleRoleSelect(role);
  } else {
    console.log(error);
    setError(
      `${roleName} is not available in the backend.`
      
    );
  }
}}
                          disabled={
                            savingRole
                          }
                        >

                          <span>
                            {roleName}
                          </span>


                          {targetRole ===
                            roleName && (

                            <span>
                              ✓
                            </span>

                          )}

                        </button>

                      );

                    }
                  )}


                  {/* ==================================================
                      OTHER
                      ================================================== */}

                  <button
                    type="button"
                    className={`target-role-option ${
                      showCustomRole
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setShowCustomRole(
                        !showCustomRole
                      )
                    }
                    disabled={savingRole}
                  >

                    <span>
                      Other
                    </span>


                    {showCustomRole && (
                      <span>
                        ✓
                      </span>
                    )}

                  </button>


                  {/* ==================================================
                      CUSTOM ROLE INPUT
                      ================================================== */}

                  {showCustomRole && (

                    <div className="custom-role-box">

                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) =>
                          setCustomRole(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {

                          if (
                            e.key === "Enter"
                          ) {

                            handleCustomRoleSave();

                          }

                        }}
                        placeholder="Enter your career..."
                        maxLength={80}
                        autoFocus
                        disabled={
                          savingRole
                        }
                      />


                      <button
                        type="button"
                        className="custom-role-save"
                        onClick={
                          handleCustomRoleSave
                        }
                        disabled={
                          savingRole ||
                          !customRole.trim()
                        }
                      >

                        {savingRole
                          ? "Saving..."
                          : "Save"}

                      </button>

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* ==================================================
                TAKE ASSESSMENT
                ================================================== */}

            <Link
              to="/assessment"
              className="primary-action"
            >

              <span>
                Take Assessment
              </span>

              <span className="action-arrow">
                ↗
              </span>

            </Link>

          </div>

        </header>


        {/* ==================================================
            QUICK STATUS
            ================================================== */}

        <section className="status-strip">


          <div className="status-item">

            <span className="status-indicator online"></span>

            <div>

              <span className="status-label">
                PROFILE
              </span>

              <span className="status-value">
                Active
              </span>

            </div>

          </div>


          <div className="status-divider"></div>


          <div className="status-item">

            <span className="status-symbol">
              ◇
            </span>

            <div>

              <span className="status-label">
                CAREER TRACK
              </span>

              <span className="career-track-value">

                {targetRole ||
                  "Not selected"}

              </span>

            </div>

          </div>


          <div className="status-divider"></div>


          <div className="status-item">

            <span className="status-symbol">
              ✦
            </span>

            <div>

              <span className="status-label">
                SYSTEM
              </span>

              <span className="status-value">
                Ready to improve
              </span>

            </div>

          </div>

        </section>
<section className="dashboard-card my-skills-card">

        <div className="card-header">

          <div>

            <span className="card-kicker">
              YOUR CAREER PROFILE
            </span>

            <h2>
              My Skills
            </h2>

            <p>
              Manage the technologies, tools and concepts
              you already know.
            </p>

          </div>


          <button
            type="button"
            className="card-link"
            onClick={() => navigate("/skills")}
          >

            Manage Skills

            <span>
              ↗
            </span>

          </button>

        </div>


        <div className="my-skills-content">

          <div className="my-skills-message">

            <div className="my-skills-icon">
              ✦
            </div>


            <div className="my-skills-text">

              {/* <span className="my-skills-label">
                KEEP YOUR PROFILE UPDATED
              </span> */}

              <h3>
                Add or update your current skills
              </h3>

              <p>
                Tell us what you already know so your
                skill-gap analysis and career roadmap can
                reflect your actual starting point.
              </p>

            </div>

          </div>


          

        </div>

      </section>

        {/* ==================================================
            METRICS
            ================================================== */}

        <section className="metrics-grid">


          {/* READINESS */}

          <div className="metric-card readiness-card">

            <div className="metric-top">

              <div className="metric-icon purple-icon">
                <span>◈</span>
              </div>

              <span className="metric-tag">
                CAREER
              </span>

            </div>


            <div className="metric-content">

              <p className="metric-label">
                Career Readiness
              </p>


              <div className="metric-number-row">

                <span className="metric-number">
                  {readinessScore}
                </span>

                <span className="metric-percent">
                  %
                </span>

              </div>


              <p className="metric-description">

                {getReadinessLabel(
                  readinessScore
                )}

              </p>

            </div>


            <div className="metric-progress">

              <div className="metric-progress-track">

                <div
                  className="metric-progress-fill purple-fill"
                  style={{
                    width: `${Math.min(
                      readinessScore,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>


          {/* OVERALL PROGRESS */}

          <div className="metric-card progress-card">

            <div className="metric-top">

              <div className="metric-icon blue-icon">
                <span>↗</span>
              </div>

              <span className="metric-tag">
                PROGRESS
              </span>

            </div>


            <div className="metric-content">

              <p className="metric-label">
                Overall Progress
              </p>


              <div className="metric-number-row">

                <span className="metric-number">
                  {overallProgress}
                </span>

                <span className="metric-percent">
                  %
                </span>

              </div>


              <p className="metric-description">

                {getProgressLabel(
                  overallProgress
                )}

              </p>

            </div>


            <div className="metric-progress">

              <div className="metric-progress-track">

                <div
                  className="metric-progress-fill blue-fill"
                  style={{
                    width: `${Math.min(
                      overallProgress,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>


          {/* MISSING SKILLS */}

          <div className="metric-card missing-card">

            <div className="metric-top">

              <div className="metric-icon orange-icon">
                <span>!</span>
              </div>

              <span className="metric-tag">
                FOCUS
              </span>

            </div>


            <div className="metric-content">

              <p className="metric-label">
                Missing Skills
              </p>


              <div className="metric-number-row">

                <span className="metric-number">
                  {missingSkills.length}
                </span>

                <span className="metric-word">
                  skills
                </span>

              </div>


              <p className="metric-description">
                Areas to improve
              </p>

            </div>


            <div className="metric-progress">

              <div className="metric-progress-track">

                <div
                  className="metric-progress-fill orange-fill"
                  style={{
                    width: `${Math.min(
                      missingSkills.length *
                        12,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            MAIN DASHBOARD GRID
            ================================================== */}

        

           <section className="main-dashboard-grid">
          {/* ==================================================
              SKILL GAP
              ================================================== */}

          <div className="dashboard-card skill-card">

            <div className="card-header">

              <div>

                <span className="card-kicker">
                  ANALYSIS
                </span>

                <h2>
                  Your Skill Gap
                </h2>

                <p>
                  Understand where you stand
                  and what to learn next.
                </p>

              </div>


              <Link
                to={
                  targetRoleSlug
                    ? `/skill-gap?role=${targetRoleSlug}`
                    : "/skill-gap"
                }
                className="card-link"
              >

                View Analysis

                <span>
                  ↗
                </span>

              </Link>

            </div>


            <div className="skill-columns">


              {/* STRONG */}

              <div className="skill-column">

                <div className="skill-heading">

                  <span className="skill-dot strong-dot"></span>

                  <span>
                    Strong
                  </span>

                  <small>
                    {strongSkills.length}
                  </small>

                </div>


                <div className="skill-list">

                  {strongSkills.length >
                  0 ? (

                    strongSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="skill-pill strong-pill"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <span className="empty-skill">
                      No strong skills yet
                    </span>

                  )}

                </div>

              </div>


              {/* MODERATE */}

              <div className="skill-column">

                <div className="skill-heading">

                  <span className="skill-dot moderate-dot"></span>

                  <span>
                    Moderate
                  </span>

                  <small>
                    {moderateSkills.length}
                  </small>

                </div>


                <div className="skill-list">

                  {moderateSkills.length >
                  0 ? (

                    moderateSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="skill-pill moderate-pill"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <span className="empty-skill">
                      No moderate skills
                    </span>

                  )}

                </div>

              </div>


              {/* MISSING */}

              <div className="skill-column">

                <div className="skill-heading">

                  <span className="skill-dot missing-dot"></span>

                  <span>
                    Missing
                  </span>

                  <small>
                    {missingSkills.length}
                  </small>

                </div>


                <div className="skill-list">

                  {missingSkills.length >
                  0 ? (

                    missingSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="skill-pill missing-pill"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <span className="empty-skill">
                      No missing skills
                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              ROADMAP
              ================================================== */}

          <div className="dashboard-card roadmap-card">

            <div className="card-header">

              <div>

                <span className="card-kicker">
                  YOUR PATH
                </span>

                <h2>
                  Career Roadmap
                </h2>

              </div>


              {/* <Link
                to={
                  targetRoleSlug
                    ? `/roadmap?role=${targetRoleSlug}`
                    : "/roadmap"
                }
                className="card-link"
              > */}
              <Link
  to="/career-roadmap"
  className="card-link"
>

                Open

                <span>
                  ↗
                </span>

              </Link>

            </div>


            {roadmap ? (

              <div className="roadmap-content">

                <div
                  className="progress-ring"
                  style={{
                    "--progress":
                      `${roadmapProgress}%`,
                  }}
                >

                  <div className="progress-ring-inner">

                    <strong>
                      {roadmapProgress}%
                    </strong>

                    <span>
                      complete
                    </span>

                  </div>

                </div>


                <div className="roadmap-info">

                  <span className="roadmap-status">
                    ROADMAP ACTIVE
                  </span>

                  <h3>
                    Keep building momentum.
                  </h3>

                  <p>
                    Your personalized learning
                    journey is{" "}
                    {roadmapProgress}%
                    complete.
                  </p>


                  <div className="roadmap-meta">

                    <div>

                      <span>
                        DURATION
                      </span>

                      <strong>
                        {roadmap.totalWeeks}{" "}
                        weeks
                      </strong>

                    </div>


                    <div>

                      <span>
                        STATUS
                      </span>

                      <strong>
                        In progress
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="roadmap-empty">

                <div className="empty-roadmap-icon">
                  ◇
                </div>

                <h3>
                  Your roadmap is waiting.
                </h3>

                <p>
                  Complete your assessment to
                  generate a personalized career
                  roadmap.
                </p>

                

              </div>

            )}

          </div>

        </section>





        {/* ==================================================
            PROJECTS
            ================================================== */}

        <section className="dashboard-card projects-card">

          <div className="card-header">

            <div>

              <span className="card-kicker">
                BUILD TO LEARN
              </span>

              <h2>
                Recommended Projects
              </h2>

              <p>
                Build these projects to turn
                knowledge into proof of skill.
              </p>

            </div>


            <Link
              to={
                targetRoleSlug
                  ? `/skill-gap?role=${targetRoleSlug}`
                  : "/skill-gap"
              }
              className="card-link"
            >

              Explore All

              <span>
                ↗
              </span>

            </Link>

          </div>


          <div className="projects-grid">

            {recommendations.length >
            0 ? (

              recommendations
                .slice(0, 4)
                .map(
                  (item, index) => (

                    <div
                      key={
                        item.project?._id ||
                        index
                      }
                      className="project-card"
                    >

                      <div className="project-number">
                        0{index + 1}
                      </div>


                      <div className="project-top">

                        <div className="project-category">
                          PROJECT
                        </div>


                        <div className="match-score">

                          <span>
                            {item.matchScore ??
                              0}
                          </span>

                          <small>
                            % MATCH
                          </small>

                        </div>

                      </div>


                      <h3>
                        {item.project?.title ||
                          "Recommended Project"}
                      </h3>


                      <p>
                        {item.project?.description ||
                          "A practical project designed to improve your career-ready skills."}
                      </p>


                      <div className="project-bottom">

                        <span className="difficulty-badge">

                          {item.project?.difficulty ||
                            "Intermediate"}

                        </span>


                        <span className="project-arrow">
                          →
                        </span>

                      </div>

                    </div>

                  )
                )

            ) : (

              <div className="projects-empty">

                <div>
                  ◇
                </div>

                <h3>
                  Projects will appear here
                </h3>

                <p>
                  Complete your assessment to
                  receive personalized project
                  recommendations.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            QUICK ACTIONS
            ================================================== */}

        <section className="quick-actions-section">


          <div className="quick-heading">

            <div>

              <span className="card-kicker">
                QUICK ACCESS
              </span>

              <h2>
                Keep moving forward
              </h2>

            </div>

          </div>


          <div className="quick-actions-grid">


            <Link
              to="/assessment"
              className="quick-action primary-quick"
            >

              <div className="quick-action-icon">
                ↗
              </div>

              <div className="quick-action-text">

                <strong>
                  Take Assessment
                </strong>

                <span>
                  Discover your skill gaps
                </span>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>


            <Link
              to="/skill-gap"
              className="quick-action"
            >

              <div className="quick-action-icon">
                ◈
              </div>

              <div className="quick-action-text">

                <strong>
                  Skill Gap
                </strong>

                <span>
                  Analyze your strengths
                </span>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>


            <Link
              to="/roadmap"
              className="quick-action"
            >

              <div className="quick-action-icon">
                ◇
              </div>

              <div className="quick-action-text">

                <strong>
                  Roadmap
                </strong>

                <span>
                  Follow your learning path
                </span>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>


            <Link
              to="/progress"
              className="quick-action"
            >

              <div className="quick-action-icon">
                ↗
              </div>

              <div className="quick-action-text">

                <strong>
                  Progress
                </strong>

                <span>
                  See how far you've come
                </span>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

          </div>

        </section>


        {/* ==================================================
            FOOTER
            ================================================== */}

        <footer className="dashboard-footer">

          <span>
            STUDENT SKILL-GAP & CAREER PLANNER
          </span>

          <span className="footer-line"></span>

          <span>
            BUILD YOUR FUTURE
          </span>

        </footer>

      </main>

    </div>
  );
};

export default Dashboard;