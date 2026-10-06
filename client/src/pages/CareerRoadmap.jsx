import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CareerRoadmap.css";
import {
  generateRoadmap,
  getRoadmapByRole,
  getLatestRoadmap
} from "../api/roadmap";

function CareerRoadmap() {
  const navigate = useNavigate();

  const savedRole = localStorage.getItem("targetRole");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your current skills...",
    "Comparing your skill gap...",
    "Building your personalized roadmap with Gemini..."
  ];

  useEffect(() => {
    loadRoadmap();
  }, []);

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [generating]);

  const sanitizeErrorMessage = (err) => {
    const raw = err.response?.data?.message || err.message || "";
    if (raw.includes("{") || raw.includes("code") || raw.includes("models/")) {
      return "Something went wrong while generating your personalized roadmap. Please try again.";
    }
    return raw || "Something went wrong while generating your personalized roadmap. Please try again.";
  };

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const role = savedRole || localStorage.getItem("targetRole");
      let result;

      if (role && role !== "null" && role !== "undefined") {
        result = await getRoadmapByRole(role);
      } else {
        result = await getLatestRoadmap();
      }

      setRoadmap(result.data);
      if (result.data?.targetRole) {
        localStorage.setItem("targetRole", result.data.targetRole);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        const role = savedRole || localStorage.getItem("targetRole") || "";
        await createRoadmap(role);
      } else {
        console.error("Roadmap load error:", error);
        setError(sanitizeErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const createRoadmap = async (customRole) => {
    try {
      setGenerating(true);
      setLoadingMessageIndex(0);
      setError("");

      const roleToUse =
        customRole ||
        roadmap?.targetRole ||
        savedRole ||
        localStorage.getItem("targetRole") ||
        "";

      const result = await generateRoadmap(roleToUse);

      setRoadmap(result.data);
      if (result.data?.targetRole) {
        localStorage.setItem("targetRole", result.data.targetRole);
      }
    } catch (error) {
      console.error("Roadmap generation error:", error);
      setError(sanitizeErrorMessage(error));
    } finally {
      setGenerating(false);
    }
  };

  if (loading || generating) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="roadmap-label">YOUR CAREER PATH</div>

          <h1>{roadmap?.targetRole || savedRole || "Career Path"}</h1>

          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="roadmap-spinner" style={{
              width: "42px",
              height: "42px",
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              marginBottom: "16px"
            }} />
            <p style={{ color: "#a5b4fc", fontWeight: 500, fontSize: "16px" }}>
              {generating
                ? loadingMessages[loadingMessageIndex]
                : "Loading your roadmap..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="roadmap-label">YOUR CAREER PATH</div>

          <h1>{savedRole || "Career Roadmap"}</h1>

          <div style={{
            marginTop: "20px",
            padding: "16px 20px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "12px",
            color: "#fca5a5",
            maxWidth: "600px",
            margin: "20px auto 0"
          }}>
            <p style={{ margin: 0, fontSize: "15px" }}>{error}</p>
          </div>

          <button
            className="primary-action"
            onClick={() => createRoadmap()}
            style={{ marginTop: "24px" }}
          >
            Try Again / Generate Roadmap
          </button>
        </div>
      </div>
    );
  }

  const roleName = roadmap?.targetRole || savedRole;
  const estimatedDuration =
    roadmap?.estimatedTotalDuration ||
    (roadmap?.totalWeeks ? `${roadmap.totalWeeks} weeks` : "8-12 weeks");
  const alreadyKnown = roadmap?.alreadyKnownSkills || [];
  const missing = roadmap?.missingSkills || [];
  const phases = roadmap?.phases || [];
  const items = roadmap?.items || [];

  return (
    <div className="roadmap-page">
      {/* HEADER */}
      <div className="roadmap-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div className="roadmap-label">YOUR CAREER PATH</div>
        <h1>{roleName}</h1>
        <p style={{ color: "#a5b4fc", fontSize: "16px", marginTop: "4px" }}>
          Estimated completion: <strong>{estimatedDuration}</strong>
        </p>
        <p>{roadmap?.description}</p>
      </div>

      {/* PERSONALIZED SKILLS PROFILE CARD */}
      {(alreadyKnown.length > 0 || missing.length > 0) && (
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 28px",
            padding: "20px 24px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {alreadyKnown.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", letterSpacing: "0.08em", color: "#34d399", fontWeight: 700, marginBottom: "10px" }}>
                  BASED ON YOUR CURRENT SKILLS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {alreadyKnown.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "20px",
                        color: "#6ee7b7",
                        fontSize: "12px",
                        fontWeight: 500
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missing.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", letterSpacing: "0.08em", color: "#818cf8", fontWeight: 700, marginBottom: "10px" }}>
                  SKILLS TO DEVELOP
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {missing.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(99, 102, 241, 0.12)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: "20px",
                        color: "#c7d2fe",
                        fontSize: "12px",
                        fontWeight: 500
                      }}
                    >
                      ○ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TARGET ROLE CARD */}
      <div className="target-role-card">
        <div>
          <span className="target-label">CURRENT TARGET</span>
          <h2>{roleName}</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => createRoadmap()}
            disabled={generating}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {generating ? "Generating with Gemini..." : "⚡ Regenerate with AI"}
          </button>
          <div className="target-status">Personalized roadmap</div>
        </div>
      </div>

      {/* ROADMAP PHASES */}
      <div className="roadmap-container">
        <div className="roadmap-title">
          <div>
            <span>PERSONALIZED PLAN</span>
            <h2>Your learning roadmap</h2>
          </div>

          <div className="roadmap-progress">
            <strong>{estimatedDuration}</strong>
          </div>
        </div>

        <div className="timeline">
          {phases.length > 0
            ? phases.map((phase, index) => (
                <div className="timeline-item" key={phase._id || index}>
                  <div className="timeline-marker">{index + 1}</div>

                  <div className="timeline-content">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div className="month-label">PHASE {phase.phaseNumber || index + 1}</div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "rgba(99, 102, 241, 0.15)",
                          color: "#a5b4fc",
                          border: "1px solid rgba(99, 102, 241, 0.3)"
                        }}
                      >
                        ⏱ {phase.duration}
                      </span>
                    </div>

                    <h3 style={{ marginTop: "6px" }}>{phase.title}</h3>

                    {phase.why && (
                      <p style={{ fontStyle: "italic", color: "#c7d2fe", marginTop: "6px", fontSize: "14px" }}>
                        <strong>Why:</strong> {phase.why}
                      </p>
                    )}

                    {phase.topics?.length > 0 && (
                      <div className="roadmap-skills" style={{ marginTop: "10px" }}>
                        {phase.topics.map((topic, i) => (
                          <span key={i} className="roadmap-skill">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {phase.skills?.length > 0 && (
                      <div className="roadmap-skills" style={{ marginTop: "8px" }}>
                        {phase.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="roadmap-skill"
                            style={{
                              background: "rgba(139, 92, 246, 0.15)",
                              borderColor: "rgba(139, 92, 246, 0.3)",
                              color: "#d8b4fe"
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {phase.estimatedHours && (
                      <div style={{ marginTop: "14px", color: "#777789", fontSize: "12px" }}>
                        Estimated time: {phase.estimatedHours} hours
                      </div>
                    )}
                  </div>
                </div>
              ))
            : items.map((item, index) => (
                <div className="timeline-item" key={item._id || index}>
                  <div className="timeline-marker">{index + 1}</div>

                  <div className="timeline-content">
                    <div className="month-label">
                      Weeks {item.weekStart} – {item.weekEnd}
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    {item.topics?.length > 0 && (
                      <div className="roadmap-skills">
                        {item.topics.map((topic, i) => (
                          <span key={i} className="roadmap-skill">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: "15px", color: "#777789", fontSize: "12px" }}>
                      Estimated time: {item.estimatedHours} hours
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* FINAL GOAL */}
      <div className="roadmap-finish">
        <div className="finish-icon">✓</div>
        <div>
          <span>FINAL GOAL</span>
          <h2>Become job-ready for {roleName}</h2>
          <p>
            Follow this roadmap, build projects that demonstrate your skills and
            prepare for interviews.
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="roadmap-actions">
        <button
          className="secondary-action"
          onClick={() => navigate("/skills")}
        >
          Manage My Skills
        </button>

        <button
          className="primary-action"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default CareerRoadmap;