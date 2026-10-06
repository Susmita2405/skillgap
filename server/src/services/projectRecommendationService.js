import Project from "../models/Project.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import UserSkill from "../models/UserSkill.js";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import { recalculateAndSaveSkillGap } from "./skillGapService.js";
import { executeGeminiRequest } from "./geminiService.js";

const slugify = (text) => {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const inFlightRecommendations = new Map();

export const generateProjectRecommendations = async (userId, targetRole) => {
  if (!targetRole) {
    throw new Error("Target role is required for project recommendations.");
  }

  const cacheKey = `${userId}_${String(targetRole).trim().toLowerCase()}`;
  if (inFlightRecommendations.has(cacheKey)) {
    return inFlightRecommendations.get(cacheKey);
  }

  const promise = (async () => {
    try {
      return await generateProjectRecommendationsInternal(userId, targetRole);
    } finally {
      inFlightRecommendations.delete(cacheKey);
    }
  })();

  inFlightRecommendations.set(cacheKey, promise);
  return promise;
};

const generateProjectRecommendationsInternal = async (userId, targetRole) => {

  /*
   * 1. GET SKILL GAP DATA (Single source of truth)
   */
  let analysis = await SkillGapAnalysis.findOne({
    user: userId,
    targetRole
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!analysis || !analysis.skills?.length) {
    try {
      analysis = await recalculateAndSaveSkillGap(userId, targetRole);
      if (analysis?.toObject) analysis = analysis.toObject();
    } catch (err) {
      console.warn("[ProjectRecService] Recalculating skill gap error:", err?.message);
    }
  }

  const missingSkills = analysis?.missingSkills || [];
  const moderateSkills = analysis?.moderateSkills || [];
  const strongSkills = analysis?.strongSkills || [];
  const readinessScore = analysis?.readinessScore ?? 0;

  // Existing user skills
  const userSkills = await UserSkill.find({ user: userId }).lean();
  const userDoc = await User.findById(userId).lean();
  const knownSkills = [
    ...userSkills.map((s) => s.name),
    ...(userDoc?.currentSkills || []),
    ...strongSkills
  ].filter(Boolean);

  // Assessment info
  let assessmentSummary = "Not completed";
  const assessment = await Assessment.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
  if (assessment) {
    assessmentSummary = `Overall Score: ${assessment.overallScore}%`;
  }

  /*
   * 2. GEMINI PROMPT TO GENERATE TARGETED PROJECTS
   */
  const prompt = `
You are an expert technical mentor recommending personalized hands-on software projects.

TARGET ROLE:
${targetRole}

KNOWN SKILLS:
${knownSkills.length > 0 ? Array.from(new Set(knownSkills)).join(", ") : "Beginner / fundamental knowledge"}

MISSING SKILLS THAT MUST BE TARGETED:
${missingSkills.length > 0 ? missingSkills.join(", ") : "Modern best practices and advanced topics"}

MODERATE SKILLS:
${moderateSkills.length > 0 ? moderateSkills.join(", ") : "None"}

CAREER READINESS:
${readinessScore}%

ASSESSMENT:
${assessmentSummary}

TASK:
Generate 3 to 4 practical, production-level projects that specifically target and close the user's missing skills.
Each project MUST focus directly on helping the user learn and implement their missing skills.
For example:
- If missing REST API/Node.js, recommend an API project with Node.js/Express.
- If missing React, recommend a responsive React application.
- If missing MongoDB/SQL, recommend a full database-driven application.
- If missing Testing, include automated testing in the project requirements.

Return ONLY valid JSON matching this exact structure:
[
  {
    "title": "Production REST API",
    "difficulty": "Intermediate",
    "estimatedDuration": "7 days",
    "estimatedWeeks": 2,
    "targetedMissingSkills": ["REST API", "Node.js", "Express", "Error Handling"],
    "description": "Comprehensive project description explaining why this project bridges the skill gap.",
    "requirements": [
      "JWT-based Authentication & Authorization",
      "CRUD endpoints with query filters",
      "Data validation using Joi or Zod",
      "Centralized error handling middleware",
      "API documentation with Swagger or Postman"
    ],
    "expectedLearningOutcome": "Demonstrates mastery of backend API architecture and HTTP communication."
  }
]
`;

  console.log(`[ProjectRecService] Requesting Gemini project recommendations for target role: ${targetRole}`);
  const projectsList = await executeGeminiRequest({
    prompt,
    config: {
      temperature: 0.3
    }
  });

  if (!Array.isArray(projectsList) || projectsList.length === 0) {
    throw new Error("Failed to generate personalized project recommendations with Gemini.");
  }

  /*
   * 3. UPSERT PROJECTS IN DATABASE & PREPARE RECOMMENDATIONS
   */
  const recommendations = [];

  for (const item of projectsList) {
    const title = item.title || "Custom Practical Project";
    const slug = `${slugify(targetRole)}-${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

    const targeted = Array.isArray(item.targetedMissingSkills)
      ? item.targetedMissingSkills
      : [];

    const requirements = Array.isArray(item.requirements) ? item.requirements : [];

    const difficulty = ["Beginner", "Intermediate", "Advanced"].includes(item.difficulty)
      ? item.difficulty
      : "Intermediate";

    const estimatedWeeks = Number(item.estimatedWeeks) || 2;

    const projectDoc = await Project.create({
      title,
      slug,
      description: item.description || "Personalized project to build hands-on mastery.",
      difficulty,
      estimatedWeeks,
      skills: targeted.length > 0 ? targeted : [targetRole],
      targetedMissingSkills: targeted,
      requirements,
      expectedLearningOutcome: item.expectedLearningOutcome || "",
      estimatedDuration: item.estimatedDuration || `${estimatedWeeks} weeks`,
      isActive: true
    });

    recommendations.push({
      project: projectDoc,
      matchScore: Math.min(98, Math.max(70, 100 - (missingSkills.length * 4))),
      matchedSkills: strongSkills.slice(0, 3),
      skillsToLearn: targeted,
      targetedMissingSkills: targeted,
      requirements,
      expectedLearningOutcome: item.expectedLearningOutcome || "",
      estimatedDuration: item.estimatedDuration || `${estimatedWeeks} weeks`
    });
  }

  return recommendations;
};