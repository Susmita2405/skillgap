import { GoogleGenAI } from "@google/genai";

import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import UserSkill from "../models/UserSkill.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


const normalizeRole = (role) => {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};


const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


const generateRoadmap = async (
  userId,
  targetRole
) => {

  if (!targetRole) {
    throw new Error(
      "Target role is required"
    );
  }


  /*
   * ------------------------------------------------
   * 1. FIND THE TARGET ROLE
   * ------------------------------------------------
   */

  const normalizedRole =
    normalizeRole(targetRole);


  const role =
    await Role.findOne({
      $or: [
        {
          slug: normalizedRole
        },
        {
          name: String(targetRole).trim()
        }
      ],
      isActive: true
    }).lean();


  if (!role) {
    throw new Error(
      `Target role not found: ${targetRole}`
    );
  }


  /*
   * ------------------------------------------------
   * 2. GET ALL AVAILABLE SKILLS
   * ------------------------------------------------
   */

  const allSkills =
    await Skill.find({
      isActive: true
    }).lean();


  /*
   * ------------------------------------------------
   * 3. GET STUDENT'S CURRENT SKILLS
   * ------------------------------------------------
   */

  const userSkills =
    await UserSkill.find({
      user: userId
    }).lean();


  const currentSkills =
    userSkills.map((skill) => ({
      name: skill.name,
      normalizedName:
        skill.normalizedName ||
        normalizeSkill(skill.name),
      proficiency:
        skill.proficiency || "beginner"
    }));


  /*
   * ------------------------------------------------
   * 4. GET ROLE REQUIREMENTS
   * ------------------------------------------------
   */

  const roleRequirements =
    role.skills.map((roleSkill) => {

      const databaseSkill =
        allSkills.find(
          (skill) =>
            skill.slug === roleSkill.slug
        );

      return {
        slug: roleSkill.slug,

        name:
          databaseSkill?.name ||
          roleSkill.slug,

        importance:
          roleSkill.importance,

        priority:
          roleSkill.priority,

        difficulty:
          databaseSkill?.difficulty ||
          "Intermediate"
      };
    });


  /*
   * ------------------------------------------------
   * 5. CREATE AI INPUT
   *
   * NO PREVIOUS SKILL-GAP ANALYSIS REQUIRED.
   * GEMINI DOES THE ANALYSIS HERE.
   * ------------------------------------------------
   */

  const studentSkillText =
    currentSkills.length > 0
      ? currentSkills
          .map(
            (skill) =>
              `${skill.name} (${skill.proficiency})`
          )
          .join(", ")
      : "No skills have been added yet.";


  const roleSkillText =
    roleRequirements
      .map(
        (skill) =>
          `${skill.name} | slug: ${skill.slug} | importance: ${skill.importance} | priority: ${skill.priority} | difficulty: ${skill.difficulty}`
      )
      .join("\n");


  /*
   * ------------------------------------------------
   * 6. GEMINI PROMPT
   * ------------------------------------------------
   */

  const prompt = `
You are an expert career-planning AI.

Create a PERSONALIZED learning roadmap for a student.

TARGET ROLE:
${role.name}

ROLE DESCRIPTION:
${role.description}

STUDENT'S CURRENT SKILLS:
${studentSkillText}

SKILLS REQUIRED FOR THIS ROLE:
${roleSkillText}


YOUR JOB:

First analyze the student's current skills against the
requirements of the target role.

Then identify:

- strong skills
- moderate skills
- weak skills
- missing skills

Then create a realistic learning roadmap.


VERY IMPORTANT:

The roadmap duration MUST NOT be fixed to 24 weeks.

The total duration must depend on the actual target role,
the breadth of the role, the student's current skills,
the difficulty of the missing skills, and the amount of
learning required to become reasonably job-ready.

Use a realistic duration between approximately 8 and 24 weeks.

Examples:

- A focused Frontend Developer path may reasonably take
  around 10-16 weeks depending on the student's current skills.

- A Backend Developer path may require more time if the
  student lacks programming, databases, APIs, authentication,
  deployment, etc.

- A Full Stack Developer path normally requires substantially
  more time because it combines frontend and backend skills.

- A Machine Learning path may require substantially more time
  because it can involve Python, mathematics, statistics,
  data processing, machine learning algorithms, evaluation,
  projects, etc.

These are examples only.

DO NOT copy these durations blindly.

YOU must determine the appropriate duration from the actual
target role and student's skill gaps.


TIME ALLOCATION:

Do NOT give every skill the same amount of time.

A small topic may take a few days or approximately one week.

A medium-sized technology may take one or several weeks.

A large subject may require several weeks.

For example, do not spend four weeks teaching basic HTML if
the student only needs HTML fundamentals.

Likewise, do not try to teach an entire broad subject such as
Machine Learning in one week.

Allocate time according to:

1. difficulty
2. breadth of the subject
3. importance for the target role
4. prerequisites
5. student's existing proficiency
6. student's skill gaps
7. practical project requirements


PERSONALIZATION:

If the student already knows a skill:

- DO NOT reteach its basic fundamentals.
- Only include it if an advanced part is required.
- If it is already strong and not necessary to improve,
  skip it.

Do not waste roadmap time teaching skills the student
already knows.


ORDER:

Create logical prerequisites.

For example:

programming fundamentals
→ framework/backend/data concepts
→ APIs/data processing
→ advanced concepts
→ production skills
→ project


PROJECTS:

The roadmap must contain practical work.

Projects should appear after enough relevant skills have
been learned.

The final project should demonstrate the skills required
for the target role.


IMPORTANT:

Do not create artificial monthly sections.

Use actual week ranges.

Some roadmap items may take:

- 1 week
- 2 weeks
- 3 weeks
- 4 weeks

depending on their complexity.

The TOTAL roadmap duration must be the duration you determine
is appropriate for this student and this role.


RETURN ONLY VALID JSON.

Use exactly this structure:

{
  "totalWeeks": 12,
  "analysis": {
    "strongSkills": [],
    "moderateSkills": [],
    "weakSkills": [],
    "missingSkills": []
  },
  "items": [
    {
      "weekStart": 1,
      "weekEnd": 1,
      "title": "HTML fundamentals",
      "description": "Learn only the HTML concepts required for the target role.",
      "skillSlugs": ["html"],
      "topics": [
        "Semantic HTML",
        "Forms",
        "Accessibility basics"
      ],
      "estimatedHours": 8,
      "priority": 3
    }
  ]
}

RULES FOR ITEMS:

- weekStart must be >= 1
- weekEnd must be >= weekStart
- weekEnd must be <= totalWeeks
- totalWeeks must be between 8 and 24
- estimatedHours must be realistic
- do not create duplicate learning items
- do not create filler content
- skillSlugs must correspond to skills from the supplied role requirements
  whenever possible
- topics must be specific
- roadmap items must fit inside totalWeeks
- do not leave unexplained gaps between weeks
- the final roadmap should end at totalWeeks
`;


  /*
   * ------------------------------------------------
   * 7. CALL GEMINI
   * ------------------------------------------------
   */

  let response;

const maxAttempts = 4;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    response = await ai.models.generateContent({
      model:
        process.env.GEMINI_MODEL ||
        "gemini-3.8-flash",

      contents: prompt,

      config: {
        responseMimeType:
          "application/json",

        temperature: 0.4,

        responseSchema: {
          type: "object",

          properties: {
            totalWeeks: {
              type: "integer"
            },

            analysis: {
              type: "object",

              properties: {
                strongSkills: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },

                moderateSkills: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },

                weakSkills: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                },

                missingSkills: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              },

              required: [
                "strongSkills",
                "moderateSkills",
                "weakSkills",
                "missingSkills"
              ]
            },

            items: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  weekStart: {
                    type: "integer"
                  },

                  weekEnd: {
                    type: "integer"
                  },

                  title: {
                    type: "string"
                  },

                  description: {
                    type: "string"
                  },

                  skillSlugs: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },

                  topics: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },

                  estimatedHours: {
                    type: "number"
                  },

                  priority: {
                    type: "integer"
                  }
                },

                required: [
                  "weekStart",
                  "weekEnd",
                  "title",
                  "description",
                  "skillSlugs",
                  "topics",
                  "estimatedHours",
                  "priority"
                ]
              }
            }
          },

          required: [
            "totalWeeks",
            "analysis",
            "items"
          ]
        }
      }
    });

    break;
  } catch (error) {
    if (
  error?.status !== 503 ||
  attempt === maxAttempts
) {
  throw error;
}

    const delay = 2000 * Math.pow(2, attempt - 1);

    console.log(
      `Gemini temporarily unavailable. Retrying in ${
        delay / 1000
      } seconds... (attempt ${attempt}/${maxAttempts})`
    );

    await new Promise((resolve) =>
      setTimeout(resolve, delay)
    );
  }
}

          /*
   * ------------------------------------------------
   * 8. PARSE GEMINI RESPONSE
   * ------------------------------------------------
   */

  let generated;

  try {

    generated =
      JSON.parse(response.text);

  } catch (error) {

    console.error(
      "Invalid Gemini roadmap response:",
      response.text
    );

    throw new Error(
      "Gemini returned an invalid roadmap"
    );
  }


  /*
   * ------------------------------------------------
   * 9. VALIDATE TOTAL DURATION
   * ------------------------------------------------
   */

  const totalWeeks =
    Math.min(
      24,
      Math.max(
        8,
        Number(generated.totalWeeks) || 12
      )
    );


  /*
   * ------------------------------------------------
   * 10. CONVERT AI SKILLS TO MONGODB SKILLS
   * ------------------------------------------------
   */

  const items =
    generated.items.map((item) => {

      const skillIds =
        item.skillSlugs
          .map((slug) =>
            allSkills.find(
              (skill) =>
                skill.slug ===
                String(slug)
                  .trim()
                  .toLowerCase()
            )
          )
          .filter(Boolean)
          .map((skill) => skill._id);


      return {

        weekStart:
          Math.max(
            1,
            Number(item.weekStart)
          ),

        weekEnd:
          Math.min(
            totalWeeks,
            Number(item.weekEnd)
          ),

        title:
          String(item.title).trim(),

        description:
          String(item.description).trim(),

        skills:
          skillIds,

        topics:
          Array.isArray(item.topics)
            ? item.topics
            : [],

        estimatedHours:
          Math.max(
            1,
            Number(item.estimatedHours) || 1
          ),

        priority:
          Math.max(
            0,
            Math.min(
              5,
              Number(item.priority) || 2
            )
          ),

        completed: false,

        completedAt: null
      };
    });


  /*
   * ------------------------------------------------
   * 11. SAVE THE AI-GENERATED SKILL ANALYSIS
   *
   * This means the user does NOT need to visit
   * Skill Gap first.
   * ------------------------------------------------
   */

  await SkillGapAnalysis.findOneAndUpdate(

    {
      user: userId,
      targetRole: role.slug
    },

    {
      user: userId,

      targetRole:
        role.slug,

      readinessScore: 0,

      strongSkills:
        generated.analysis.strongSkills || [],

      moderateSkills:
        generated.analysis.moderateSkills || [],

      weakSkills:
        generated.analysis.weakSkills || [],

      missingSkills:
        generated.analysis.missingSkills || [],

      skills:
        roleRequirements.map(
          (requiredSkill) => {

            const strong =
              generated.analysis.strongSkills
                .map(normalizeSkill)
                .includes(
                  normalizeSkill(
                    requiredSkill.name
                  )
                );

            const moderate =
              generated.analysis.moderateSkills
                .map(normalizeSkill)
                .includes(
                  normalizeSkill(
                    requiredSkill.name
                  )
                );

            const weak =
              generated.analysis.weakSkills
                .map(normalizeSkill)
                .includes(
                  normalizeSkill(
                    requiredSkill.name
                  )
                );

            const status =
              strong
                ? "Strong"
                : moderate
                ? "Moderate"
                : weak
                ? "Weak"
                : "Missing";

            return {

              skillSlug:
                requiredSkill.slug,

              required:
                requiredSkill.importance ===
                "required",

              priority:
                requiredSkill.priority,

              studentScore:
                status === "Strong"
                  ? 90
                  : status === "Moderate"
                  ? 60
                  : status === "Weak"
                  ? 30
                  : 0,

              status,

              gap:
                status === "Strong"
                  ? 10
                  : status === "Moderate"
                  ? 40
                  : status === "Weak"
                  ? 70
                  : 100
            };
          }
        )

    },

    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );


  /*
   * ------------------------------------------------
   * 12. RETURN ROADMAP TO CONTROLLER
   * ------------------------------------------------
   */

  return {

    targetRole:
      role.name,

    role:
      role._id,

    description:
      role.description,

    totalWeeks,

    items
  };
};


export {
  generateRoadmap
};