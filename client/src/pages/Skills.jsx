import React, { useEffect, useState } from "react";
import "./Skills.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const COMMON_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Git",
  "GitHub",
  "REST API",
  "TypeScript",
  "Next.js",
  "Docker",
  "AWS",
  "Machine Learning",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [message, setMessage] = useState("");

  // Load saved skills
  useEffect(() => {
  const loadSkills = async () => {
    try {
      const response = await api.get("/skills/mine");

      const backendSkills = response.data?.data || [];

      setSkills(
        backendSkills.map((skill) => ({
          id: skill._id,
          name: skill.name,
          level:
            skill.proficiency === "intermediate"
              ? "Intermediate"
              : skill.proficiency === "advanced"
              ? "Advanced"
              : "Beginner",
        }))
      );
    } catch (error) {
      console.error("Failed to load skills:", error);
    }
  };

  loadSkills();
}, []);

  // Save skills whenever they change
  // useEffect(() => {
  //   localStorage.setItem("mySkills", JSON.stringify(skills));
  // }, [skills]);

const addSkill = async (name = skillName) => {
  const cleanName = name.trim();

  if (!cleanName) {
    setMessage("Please enter a skill.");
    return;
  }

  const alreadyExists = skills.some(
    (skill) =>
      skill.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (alreadyExists) {
    setMessage("You already added this skill.");
    return;
  }

  try {
    const response = await api.post("/skills", {
      name: cleanName,
      proficiency: level.toLowerCase(),
    });

    const savedSkill = response.data?.data;

    if (!savedSkill) {
      throw new Error("Skill was not returned by the server.");
    }

    const newSkill = {
      id: savedSkill._id,
      name: savedSkill.name,
      level:
        savedSkill.proficiency === "intermediate"
          ? "Intermediate"
          : savedSkill.proficiency === "advanced"
          ? "Advanced"
          : "Beginner",
    };

    setSkills((prev) => [...prev, newSkill]);

    setSkillName("");
    setMessage(`${cleanName} added successfully!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  } catch (error) {
    console.error("Failed to add skill:", error);

    setMessage(
      error.response?.data?.message ||
      "Unable to add skill."
    );
  }
};
  const removeSkill = async (id) => {
  try {
    await api.delete(`/skills/${id}`);

    setSkills((prev) =>
      prev.filter((skill) => skill.id !== id)
    );
  } catch (error) {
    console.error("Failed to remove skill:", error);
    setMessage("Unable to remove skill.");
  }
};

  return (
    <div className="skills-page">

      {/* HEADER */}

     

<button
  type="button"
  className="back-dashboard-button"
  onClick={() => navigate("/dashboard")}
>
   Back to Dashboard
</button>




      <div className="skills-header">
        <div className="small-heading">
          YOUR CAREER PROFILE
        </div>

        <h1>What do you already know?</h1>

        <p>
          Tell us the technologies, tools and concepts you already
          know. We'll compare them against your target career.
        </p>
      </div>

      

    
      <div className="add-skill-card">

        <div className="manual-input-section">
          <label>Enter a skill</label>

          <input
            type="text"
            placeholder="e.g. JavaScript, React, SQL, Python..."
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSkill();
              }
            }}
          />
        </div>

        <div className="level-section">
          <label>Skill level</label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={`level-select ${level.toLowerCase()}`}
          >
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          className="add-button"
          onClick={() => addSkill()}
        >
          + Add Skill
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="skill-message">
          {message}
        </div>
      )}

      {/* COMMON SKILLS */}
      <div className="common-skills-card">

        <div className="section-title">
          <h2>Popular Skills</h2>

          <p>
            Quickly add skills from the list below.
          </p>
        </div>

        <div className="skills-list">
          {COMMON_SKILLS.map((skill) => {

            const alreadyAdded = skills.some(
              (item) =>
                item.name.toLowerCase() === skill.toLowerCase()
            );

            return (
              <button
                key={skill}
                className={`skill-option ${
                  alreadyAdded ? "already-added" : ""
                }`}
                onClick={() => {
                  if (!alreadyAdded) {
                    addSkill(skill);
                  }
                }}
                disabled={alreadyAdded}
              >
                <span>{skill}</span>

                <span className="skill-option-icon">
                  {alreadyAdded ? "✓" : "+"}
                </span>
              </button>
            );
          })}
        </div>

        {/* OTHER SKILL */}
        <div className="other-skill-section">

          <h3>Other</h3>

          <p>
            Can't find your skill? Add it manually.
          </p>

          <div className="other-input-row">

            <input
              type="text"
              placeholder="Type your skill here..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill();
                }
              }}
            />

            <button
              onClick={() => addSkill()}
              className="other-add-button"
            >
              Add
            </button>

          </div>

        </div>

      </div>

      {/* YOUR SKILLS */}
      <div className="your-skills-card">

        <div className="your-skills-header">

          <div>
            <h2>Your Skills</h2>

            <p>
              {skills.length}{" "}
              {skills.length === 1 ? "skill" : "skills"} added
            </p>
          </div>

        </div>

        {skills.length === 0 ? (

          <div className="empty-skills">

            <div className="empty-icon">
              +
            </div>

            <h3>No skills added yet</h3>

            <p>
              Start by adding technologies, programming languages
              or tools you already know.
            </p>

          </div>

        ) : (

          <div className="added-skills-grid">

            {skills.map((skill) => (

              <div
                className={`added-skill-card ${skill.level.toLowerCase()}`}
                key={skill.id}
              >

                <div className="added-skill-info">

                  <h3>{skill.name}</h3>

                  <span
                    className={`skill-level-badge ${skill.level.toLowerCase()}`}
                  >
                    {skill.level}
                  </span>

                </div>

                <button
                  className="remove-skill"
                  onClick={() => removeSkill(skill.id)}
                  title="Remove skill"
                >
                  ×
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Skills;