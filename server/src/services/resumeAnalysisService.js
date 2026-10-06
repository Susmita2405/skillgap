import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// HELPER: Convert anything into a string array
// =====================================================

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return Object.values(item)
          .filter(
            (v) =>
              v !== null &&
              v !== undefined &&
              String(v).trim() !== ""
          )
          .map((v) =>
            Array.isArray(v)
              ? v.join(", ")
              : String(v)
          )
          .join(" — ");
      }

      return "";
    })
    .filter(Boolean);
};


// =====================================================
// HELPER: Normalize EXPERIENCE
// =====================================================

const normalizeExperience = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          jobTitle: item,
          company: "",
          duration: "",
          location: "",
          description: "",
          achievements: []
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        jobTitle: String(
          item.jobTitle ||
          item.title ||
          item.position ||
          ""
        ),

        company: String(
          item.company ||
          item.organization ||
          ""
        ),

        duration: String(
          item.duration ||
          item.period ||
          item.date ||
          ""
        ),

        location: String(
          item.location ||
          ""
        ),

        description: String(
          item.description ||
          item.details ||
          ""
        ),

        achievements: normalizeStringArray(
          item.achievements ||
          item.responsibilities ||
          []
        )
      };
    })
    .filter(Boolean);
};


// =====================================================
// HELPER: Normalize EDUCATION
// =====================================================

const normalizeEducation = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          degree: item,
          institution: "",
          year: "",
          location: "",
          details: "",
          grade: ""
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        degree: String(
          item.degree ||
          item.course ||
          item.qualification ||
          ""
        ),

        institution: String(
          item.institution ||
          item.university ||
          item.school ||
          ""
        ),

        year: String(
          item.year ||
          item.date ||
          item.duration ||
          ""
        ),

        location: String(
          item.location ||
          ""
        ),

        details: String(
          item.details ||
          item.description ||
          ""
        ),

        grade: String(
          item.grade ||
          item.cgpa ||
          item.percentage ||
          ""
        )
      };
    })
    .filter(Boolean);
};


// =====================================================
// HELPER: Normalize PROJECTS
// =====================================================

const normalizeProjects = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          description: "",
          technologies: [],
          role: "",
          link: ""
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        name: String(
          item.name ||
          item.title ||
          ""
        ),

        description: String(
          item.description ||
          item.details ||
          ""
        ),

        technologies: normalizeStringArray(
          item.technologies ||
          item.techStack ||
          item.skills ||
          []
        ),

        role: String(
          item.role ||
          ""
        ),

        link: String(
          item.link ||
          item.url ||
          ""
        )
      };
    })
    .filter(Boolean);
};


// =====================================================
// MAIN GEMINI FUNCTION
// =====================================================

export const analyzeResumeWithGemini = async ({
  resumeText,
  targetRole
}) => {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }


  const prompt = `
You are an expert resume analyst and career advisor.

Analyze the following student's resume.

TARGET ROLE:
${targetRole || "Not specified"}

RESUME TEXT:
${resumeText}


Analyze:

1. Overall resume quality
2. ATS compatibility
3. Skills present
4. Skills missing or weak for the target role
5. Strengths
6. Weaknesses
7. Formatting problems
8. Actionable suggestions
9. Experience
10. Education
11. Projects
12. Certifications
13. Achievements
14. Languages
15. Important keywords


IMPORTANT RULES:

- Never invent information.
- Only use information actually present in the resume.
- If something is missing, return an empty array or empty string.
- Different resumes can have completely different sections.
- A resume may have no experience.
- A resume may have no projects.
- A resume may have no certifications.
- A resume may have internships instead of full-time experience.
- A resume may contain multiple projects.
- A resume may contain multiple educational qualifications.
- Do not assume every resume has the same sections.

If TARGET ROLE is provided:
compare the candidate's current skills against skills normally relevant to that role.

Do not invent skills that the candidate already has.

Scores must be integers from 0 to 100.

Return ONLY valid JSON.

Return exactly this structure:

{
  "overallScore": 0,
  "atsScore": 0,
  "summary": "",

  "detectedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "formattingIssues": [],
  "suggestions": [],
  "keywords": [],

  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "duration": "",
      "location": "",
      "description": "",
      "achievements": []
    }
  ],

  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "location": "",
      "details": "",
      "grade": ""
    }
  ],

  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "role": "",
      "link": ""
    }
  ],

  "certifications": [
    {
      "name": "",
      "issuer": "",
      "year": "",
      "link": ""
    }
  ],

  "achievements": [],
  "languages": []
}
`;


  // =====================================================
  // GEMINI REQUEST WITH RETRY
  // =====================================================

//   const models = [
//   "gemini-3.6-flash",
//   "gemini-3.7-flash",
//   "gemini-3.8-flash"
// ];
const models = [
  process.env.GEMINI_MODEL,
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash"
].filter((m, i, arr) => m && !m.includes("2.5") && arr.indexOf(m) === i);

let response = null;
let lastError = null;

for (const model of models) {

  for (let attempt = 1; attempt <= 2; attempt++) {

    try {

      console.log(
        `Gemini ${model} attempt ${attempt}`
      );

      response = await ai.models.generateContent({
        model,

        contents: prompt,

        config: {
          responseMimeType: "application/json"
        }
      });

      break;

    } catch (error) {

      lastError = error;

      console.error(
        `Gemini ${model} attempt ${attempt} failed:`,
        error?.status,
        error?.message
      );

      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            attempt * 3000
          )
        );
      }
    }
  }

  if (response) {
    break;
  }
}

// if (!response) {
//   const error = new Error(
//     "Resume analysis service is temporarily unavailable. Please try again in a few minutes."
//   );

//   error.status = 503;

//   throw error;
// }

if (!response) {
  console.error(
    "FINAL GEMINI ERROR:",
    lastError
  );

  throw lastError || new Error(
    "Gemini request failed."
  );
}


  // =====================================================
  // PARSE GEMINI JSON
  // =====================================================

  let result;

  try {

    result = JSON.parse(
      response.text
    );

  } catch (error) {

    console.error(
      "Gemini JSON parsing error:",
      response.text
    );

    throw new Error(
      "Gemini returned invalid analysis data."
    );
  }


  // =====================================================
  // RETURN NORMALIZED DATA
  // =====================================================

  return {

    overallScore:
      Number(result.overallScore) || 0,

    atsScore:
      Number(result.atsScore) || 0,

    summary:
      typeof result.summary === "string"
        ? result.summary
        : "",


    detectedSkills:
      normalizeStringArray(
        result.detectedSkills
      ),

    missingSkills:
      normalizeStringArray(
        result.missingSkills
      ),

    strengths:
      normalizeStringArray(
        result.strengths
      ),

    weaknesses:
      normalizeStringArray(
        result.weaknesses
      ),

    formattingIssues:
      normalizeStringArray(
        result.formattingIssues
      ),

    suggestions:
      normalizeStringArray(
        result.suggestions
      ),

    keywords:
      normalizeStringArray(
        result.keywords
      ),


    experience:
      normalizeExperience(
        result.experience
      ),

    education:
      normalizeEducation(
        result.education
      ),

    projects:
      normalizeProjects(
        result.projects
      ),


    certifications:
      Array.isArray(result.certifications)
        ? result.certifications
            .map((item) => {

              if (
                !item ||
                typeof item !== "object"
              ) {
                return null;
              }

              return {
                name: String(
                  item.name || ""
                ),

                issuer: String(
                  item.issuer || ""
                ),

                year: String(
                  item.year || ""
                ),

                link: String(
                  item.link ||
                  item.url ||
                  ""
                )
              };
            })
            .filter(Boolean)
        : [],


    achievements:
      normalizeStringArray(
        result.achievements
      ),

    languages:
      normalizeStringArray(
        result.languages
      )
  };
};