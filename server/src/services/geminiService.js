import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
};

export const getCandidateModels = () => {
  const envModel = process.env.GEMINI_MODEL ? String(process.env.GEMINI_MODEL).trim() : null;
  const defaults = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash"];

  const rawList = [envModel, ...defaults].filter(Boolean);
  const sanitized = [];

  for (const m of rawList) {
    // Exclude obsolete 2.5 models or duplicates
    if (!m.includes("2.5") && !sanitized.includes(m)) {
      sanitized.push(m);
    }
  }

  return sanitized.length > 0 ? sanitized : ["gemini-3.8-flash", "gemini-3.5-flash"];
};

export const executeGeminiRequest = async ({ prompt, contents, config = {} }) => {
  const ai = getAI();
  const candidateModels = getCandidateModels();
  let lastError = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: contents || prompt,
          config: {
            responseMimeType: "application/json",
            ...config
          }
        });

        const text = response?.text?.trim() || "";
        if (text) {
          const cleaned = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          return JSON.parse(cleaned);
        }
      } catch (error) {
        lastError = error;
        console.warn(
          `[GeminiService] Model '${model}' attempt ${attempt} failed:`,
          error?.message || error
        );

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  }

  console.error("[GeminiService] All candidate models failed. Last error:", lastError?.message || lastError);
  throw new Error("We couldn't reach the AI service right now. Please try again.");
};

export const generateGeminiRoadmap = async ({
  targetRole,
  roleSkills,
  userSkills,
  skillGap
}) => {
  const prompt = `
You are an expert career-learning planner.

TARGET ROLE:
${targetRole}

STUDENT CURRENT SKILLS:
${JSON.stringify(userSkills, null, 2)}

ROLE REQUIRED SKILLS:
${JSON.stringify(roleSkills, null, 2)}

CURRENT SKILL GAP ANALYSIS:
${JSON.stringify(skillGap, null, 2)}

Create a realistic learning roadmap tailored to the student.
DO NOT waste roadmap time teaching skills the student already knows well.
Prioritize missing skills and respect prerequisites.

Return ONLY valid JSON with this structure:
{
  "totalWeeks": 16,
  "title": "Learning Path for ${targetRole}",
  "description": "Comprehensive personalized career preparation roadmap.",
  "items": [
    {
      "weekStart": 1,
      "weekEnd": 2,
      "title": "Topic Title",
      "description": "Topic description and objectives",
      "topics": ["Subtopic 1", "Subtopic 2"],
      "estimatedHours": 10,
      "priority": 1
    }
  ]
}
`;

  return executeGeminiRequest({ prompt });
};