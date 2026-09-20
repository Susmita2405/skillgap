import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CareerRoadmap.css";
import {
  generateRoadmap,
  getRoadmapByRole
} from "../api/roadmap";


function CareerRoadmap() {

  const navigate = useNavigate();

    const savedRole = localStorage.getItem("targetRole");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    loadRoadmap();
  }, []);

const loadRoadmap = async () => {
  try {
    setLoading(true);
    setError("");

    // Get roadmap specifically for the selected target role
    const result = await getRoadmapByRole(savedRole);

    setRoadmap(result.data);

  } catch (error) {

    // No roadmap exists for this role yet
    if (error.response?.status === 404) {
      await createRoadmap();
    } else {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load roadmap"
      );
    }

  } finally {
    setLoading(false);
  }
};


  const createRoadmap = async () => {
    try {
      setGenerating(true);
      setError("");

      const result =
        await generateRoadmap(savedRole);

      setRoadmap(result.data);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to generate roadmap"
      );

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
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <div className="roadmap-label">
            YOUR CAREER PATH
          </div>

          <h1>{savedRole}</h1>

          <p>
            {generating
              ? "Creating your personalized roadmap..."
              : "Loading your roadmap..."}
          </p>

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
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <div className="roadmap-label">
            YOUR CAREER PATH
          </div>

          <h1>{savedRole}</h1>

          <p>{error}</p>

          <button
            className="primary-action"
            onClick={createRoadmap}
            style={{ marginTop: "20px" }}
          >
            Generate Roadmap
          </button>

        </div>

      </div>
    );
  }


  return (

    <div className="roadmap-page">


      {/* HEADER */}

      <div className="roadmap-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>


        <div className="roadmap-label">
          YOUR CAREER PATH
        </div>
<h1>
  {roadmap?.targetRole || savedRole}
</h1>

<p>
  {roadmap?.description}
</p>

      </div>


      {/* TARGET ROLE */}

      <div className="target-role-card">

        <div>

          <span className="target-label">
            CURRENT TARGET
          </span>

          <h2>
  {roadmap?.targetRole || savedRole}
</h2>

        </div>


        <div className="target-status">
          Personalized roadmap
        </div>

      </div>


      {/* ROADMAP */}

      <div className="roadmap-container">

        <div className="roadmap-title">

          <div>

            <span>
  PERSONALIZED PLAN
</span>

            <h2>
              Your learning roadmap
            </h2>

          </div>


          <div className="roadmap-progress">

           <strong>
  {roadmap?.totalWeeks || 0}
</strong>

<span>
  weeks
</span>


          </div>

        </div>


        <div className="timeline">

          {roadmap?.items?.map(
  (item, index) => (

    <div
      className="timeline-item"
      key={item._id}
    >

      <div className="timeline-marker">
        {index + 1}
      </div>


      <div className="timeline-content">

        <div className="month-label">
          Weeks {item.weekStart} – {item.weekEnd}
        </div>


        <h3>
          {item.title}
        </h3>


        <p>
          {item.description}
        </p>


        {item.topics?.length > 0 && (
          <div className="roadmap-skills">

            {item.topics.map(
              (topic) => (

                <span
                  key={topic}
                  className="roadmap-skill"
                >
                  {topic}
                </span>

              )
            )}

          </div>
        )}


        {item.skills?.length > 0 && (
          <div
            className="roadmap-skills"
            style={{
              marginTop:
                item.topics?.length
                  ? "8px"
                  : "0"
            }}
          >

            {item.skills.map(
              (skill) => (

                <span
                  key={skill._id}
                  className="roadmap-skill"
                >
                  {skill.name}
                </span>

              )
            )}

          </div>
        )}


        <div
          style={{
            marginTop: "15px",
            color: "#777789",
            fontSize: "12px"
          }}
        >
          Estimated time:{" "}
          {item.estimatedHours} hours
        </div>

      </div>

    </div>

  )
)}

        </div>

      </div>


      {/* FINAL GOAL */}

      <div className="roadmap-finish">

        <div className="finish-icon">
          ✓
        </div>


        <div>

          <span>
            FINAL GOAL
          </span>


          <h2>
            Become job-ready for{" "}
{roadmap?.targetRole || savedRole}
          </h2>


          <p>
            Follow this roadmap, build
            projects that demonstrate your
            skills and prepare for interviews.
          </p>

        </div>

      </div>


      {/* ACTIONS */}

      <div className="roadmap-actions">

        <button
          className="secondary-action"
          onClick={() =>
            navigate("/skills")
          }
        >
          Manage My Skills
        </button>


        <button
          className="primary-action"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard →
        </button>

      </div>

    </div>

  );
}


export default CareerRoadmap;