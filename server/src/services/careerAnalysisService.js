import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
};

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash"
].filter((m) => m && !m.includes("2.5"));

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (
        item &&
        typeof item === "object"
      ) {
        return (
          item.name ||
          item.skill ||
          item.title ||
          item.description ||
          item.text ||
          JSON.stringify(item)
        );
      }

      return String(item);
    })
    .filter(Boolean);
};

const normalizeNumber = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
};

const normalizeResult = (result) => {
  return {
    overallScore: normalizeNumber(
      result.overallScore
    ),

    resumeScore: normalizeNumber(
      result.resumeScore
    ),

    githubScore: normalizeNumber(
      result.githubScore
    ),

    projectScore: normalizeNumber(
      result.projectScore
    ),

    summary:
      typeof result.summary === "string"
        ? result.summary
        : "",

    detectedSkills:
      normalizeStringArray(
        result.detectedSkills
      ),

    verifiedSkills:
      normalizeStringArray(
        result.verifiedSkills
      ),

    missingSkills:
      normalizeStringArray(
        result.missingSkills
      ),

    skillGaps:
      normalizeStringArray(
        result.skillGaps
      ),

    resumeStrengths:
      normalizeStringArray(
        result.resumeStrengths
      ),

    resumeWeaknesses:
      normalizeStringArray(
        result.resumeWeaknesses
      ),

    githubStrengths:
      normalizeStringArray(
        result.githubStrengths
      ),

    githubWeaknesses:
      normalizeStringArray(
        result.githubWeaknesses
      ),

    recommendations:
      normalizeStringArray(
        result.recommendations
      ),

    projectSuggestions:
      normalizeStringArray(
        result.projectSuggestions
      ),

    nextSteps:
      normalizeStringArray(
        result.nextSteps
      ),

    resumeSuggestions:
      normalizeStringArray(
        result.resumeSuggestions
      ),

    githubSuggestions:
      normalizeStringArray(
        result.githubSuggestions
      ),

    technologies:
      normalizeStringArray(
        result.technologies
      )
  };
};

export const analyzeCareerProfileWithGemini =
  async ({
    targetRole,
    resumeText,
    githubData
  }) => {
    const prompt = `
You are an AI career analysis system for a student.

Analyze the student's RESUME and GITHUB PROFILE TOGETHER.

Do NOT produce two separate reports.

Produce ONE combined career analysis.

Target Role:
${targetRole}

========================
RESUME
========================

${resumeText}

========================
GITHUB PROFILE
========================

${JSON.stringify(
  githubData,
  null,
  2
)}

========================
IMPORTANT INSTRUCTIONS
========================

Analyze both sources together.

Compare what the student claims in the resume
with the evidence available in GitHub.

Identify skills that appear in both sources.

Identify skills that appear in the resume but have
little or no GitHub/project evidence.

Identify important skills for the target role that
are missing.

Consider:

- technical skills
- project quality
- project diversity
- GitHub activity
- programming languages
- repository quality
- documentation
- practical experience
- resume quality
- role alignment
- missing technical skills
- portfolio evidence

Do not invent experience, skills, projects,
education, employment or technologies.

Only use information supported by the provided
resume or GitHub data.

If information is unavailable, do not assume it.

Scores must be between 0 and 100.

The overall score should represent the combined
career profile, not just the resume.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "resumeScore": 0,
  "githubScore": 0,
  "projectScore": 0,

  "summary": "",

  "detectedSkills": [],

  "verifiedSkills": [],

  "missingSkills": [],

  "skillGaps": [],

  "resumeStrengths": [],

  "resumeWeaknesses": [],

  "githubStrengths": [],

  "githubWeaknesses": [],

  "recommendations": [],

  "projectSuggestions": [],

  "nextSteps": [],

  "resumeSuggestions": [],

  "githubSuggestions": [],

  "technologies": []
}

IMPORTANT:

Every item in every array must be a simple
plain string.

Do not return objects inside arrays.

Example:

"missingSkills": [
  "Docker",
  "Automated testing",
  "CI/CD"
]

NOT:

"missingSkills": [
  {
    "name": "Docker"
  }
]
`;

    let lastError = null;
    const ai = getAI();

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const text = response.text?.trim() || "";
        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          const cleaned = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

          parsed = JSON.parse(cleaned);
        }

        return normalizeResult(parsed);
      } catch (error) {
        lastError = error;
        console.warn(`Gemini combined analysis with model ${model} failed:`, error?.message);

        const status =
          error?.status ||
          error?.response?.status ||
          error?.cause?.status ||
          error?.error?.status;

        await sleep(500);
        continue;
      }
    }

    if (
      lastError?.status === 503 ||
      lastError?.response?.status === 503
    ) {
      throw new Error(
        "Gemini is temporarily unavailable. Please try again in a few moments."
      );
    }

    throw new Error(
      lastError?.message ||
        "Unable to generate combined career analysis."
    );
  };