import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import UserSkill from "../models/UserSkill.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import GithubAnalysis from "../models/GithubAnalysis.js";
import { recalculateAndSaveSkillGap } from "./skillGapService.js";
import { executeGeminiRequest } from "./geminiService.js";

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

const inFlightRoadmaps = new Map();

export const generateRoadmap = async (userId, targetRole) => {
  if (!targetRole) {
    throw new Error("Target role is required to generate roadmap.");
  }

  const cacheKey = `${userId}_${String(targetRole).trim().toLowerCase()}`;
  if (inFlightRoadmaps.has(cacheKey)) {
    return inFlightRoadmaps.get(cacheKey);
  }

  const promise = (async () => {
    try {
      return await generateRoadmapInternal(userId, targetRole);
    } finally {
      inFlightRoadmaps.delete(cacheKey);
    }
  })();

  inFlightRoadmaps.set(cacheKey, promise);
  return promise;
};

const generateRoadmapInternal = async (userId, targetRole) => {

  /*
   * 1. FIND OR RESOLVE TARGET ROLE
   */
  const normalizedRole = normalizeRole(targetRole);

  let role = await Role.findOne({
    $or: [
      { slug: normalizedRole },
      { name: String(targetRole).trim() },
      { name: new RegExp(`^${String(targetRole).trim()}$`, "i") }
    ],
    isActive: true
  }).lean();

  if (!role) {
    role = await Role.findOne({
      $or: [
        { slug: normalizedRole },
        { name: new RegExp(`^${String(targetRole).trim()}$`, "i") }
      ]
    }).lean();

    if (!role) {
      try {
        role = await Role.create({
          name: String(targetRole).trim(),
          slug: normalizedRole,
          description: `Personalized career roadmap and track for ${targetRole}`,
          category: "Software Development",
          level: "Entry Level",
          averagePreparationMonths: 6,
          skills: [],
          isActive: true
        });
        role = role.toObject ? role.toObject() : role;
      } catch {
        role = {
          _id: null,
          name: String(targetRole).trim(),
          slug: normalizedRole,
          description: `Personalized career roadmap for ${targetRole}`,
          skills: []
        };
      }
    }
  }

  /*
   * 2. COLLECT EXISTING SINGLE SOURCE OF TRUTH DATA
   */
  // A. Skill Gap Analysis (Single source of truth)
  let skillGap = await SkillGapAnalysis.findOne({
    user: userId,
    targetRole: role.slug
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!skillGap || !skillGap.skills?.length) {
    try {
      skillGap = await recalculateAndSaveSkillGap(userId, role.slug);
      if (skillGap?.toObject) skillGap = skillGap.toObject();
    } catch (err) {
      console.warn("[RoadmapService] Could not recalculate skill gap:", err?.message);
    }
  }

  const missingSkills = skillGap?.missingSkills || [];
  const moderateSkills = skillGap?.moderateSkills || [];
  const strongSkills = skillGap?.strongSkills || [];
  const readiness = skillGap?.readinessScore ?? 0;

  // B. Existing User Skills
  const userSkillsDocs = await UserSkill.find({ user: userId }).lean();
  const userDoc = await User.findById(userId).lean();

  const knownSkillsSet = new Set();
  userSkillsDocs.forEach((s) => {
    if (s.name) knownSkillsSet.add(`${s.name} (${s.proficiency || "intermediate"})`);
  });
  if (Array.isArray(userDoc?.currentSkills)) {
    userDoc.currentSkills.forEach((s) => {
      if (s) knownSkillsSet.add(`${s} (beginner)`);
    });
  }
  strongSkills.forEach((s) => knownSkillsSet.add(`${s} (strong)`));
  moderateSkills.forEach((s) => knownSkillsSet.add(`${s} (moderate)`));

  const knownSkills = Array.from(knownSkillsSet);

  // C. Assessment Results
  let assessmentInfo = "No assessment completed yet.";
  try {
    const assessment = await Assessment.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (assessment) {
      const skillBreakdown = (assessment.results || [])
        .map((r) => `${r.skillSlug}: ${r.score}% (${r.level})`)
        .join(", ");
      assessmentInfo = `Overall Score: ${assessment.overallScore}%. Skill breakdown: ${skillBreakdown || "N/A"}`;
    }
  } catch (err) {
    console.warn("[RoadmapService] Assessment lookup error:", err?.message);
  }

  // D. Resume Analysis
  let resumeInfo = "No resume analysis available.";
  try {
    const resume = await ResumeAnalysis.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (resume) {
      resumeInfo = `Score: ${resume.resumeScore || "N/A"}. Summary: ${resume.summary || ""}. Detected skills: ${(resume.detectedSkills || []).join(", ") || "None"}`;
    }
  } catch (err) {
    console.warn("[RoadmapService] Resume lookup error:", err?.message);
  }

  // E. GitHub Analysis
  let githubInfo = "No GitHub analysis available.";
  try {
    const github = await GithubAnalysis.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (github) {
      githubInfo = `Score: ${github.githubScore || "N/A"}. Summary: ${github.summary || ""}. Detected skills: ${(github.detectedSkills || []).join(", ") || "None"}`;
    }
  } catch (err) {
    console.warn("[RoadmapService] GitHub lookup error:", err?.message);
  }

  /*
   * 3. BUILD GEMINI PROMPT (Requirement 23)
   */
  const prompt = `
You are an expert career-learning planner.

The user's target role is:
${role.name || targetRole}

The user's existing skills are:
${knownSkills.length > 0 ? knownSkills.join(", ") : "None reported yet"}

The user's missing skills are:
${missingSkills.length > 0 ? missingSkills.join(", ") : "None identified"}

The user's moderate skills are:
${moderateSkills.length > 0 ? moderateSkills.join(", ") : "None"}

The user's strong skills are:
${strongSkills.length > 0 ? strongSkills.join(", ") : "None"}

The user's career readiness is:
${readiness}%

Assessment information:
${assessmentInfo}

Resume analysis:
${resumeInfo}

GitHub analysis:
${githubInfo}

Create a personalized learning roadmap.
Do not reteach skills the user already knows unless a short review is genuinely necessary.
Prioritize missing skills.
Respect prerequisites.
Estimate realistic learning time based on the user's current level.
The roadmap must be specific to this individual.
Do not create a generic roadmap based only on the target role.
Do not invent skills the user already knows.

Return ONLY valid JSON matching this exact structure:
{
  "targetRole": "${role.name || targetRole}",
  "estimatedTotalDuration": "8-10 weeks",
  "alreadyKnownSkills": ${JSON.stringify(strongSkills.length > 0 ? strongSkills : knownSkills.slice(0, 5))},
  "missingSkills": ${JSON.stringify(missingSkills)},
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase Title / Skill Focus",
      "duration": "5 days",
      "skills": ["Skill 1", "Skill 2"],
      "priority": "high",
      "why": "Clear explanation of why this phase is scheduled here given the student's current skills",
      "topics": ["Key topic A", "Key topic B"],
      "estimatedHours": 15
    }
  ]
}
`;

  /*
   * 4. CALL GEMINI (Strict: No hardcoded fallback on failure)
   */
  console.log(`[RoadmapService] Generating personalized roadmap via Gemini for role: ${role.name || targetRole}`);
  const generated = await executeGeminiRequest({
    prompt,
    config: {
      temperature: 0.3
    }
  });

  if (!generated || !Array.isArray(generated.phases) || generated.phases.length === 0) {
    throw new Error("Gemini returned an invalid roadmap structure.");
  }

  /*
   * 5. POPULATE SKILLS AND FORMAT FOR BACKWARD COMPATIBILITY
   */
  const allDbSkills = await Skill.find({ isActive: true }).lean();

  let cumulativeWeek = 1;
  const items = generated.phases.map((phase, idx) => {
    // Estimate week range
    const weekStart = cumulativeWeek;
    // rough conversion: 1-7 days -> 1 week; 2 weeks -> 2 weeks; etc.
    let weeksSpan = 1;
    const durLower = String(phase.duration || "").toLowerCase();
    if (durLower.includes("week")) {
      const match = durLower.match(/\d+/);
      weeksSpan = match ? Math.max(1, parseInt(match[0], 10)) : 2;
    } else if (durLower.includes("month")) {
      const match = durLower.match(/\d+/);
      weeksSpan = match ? parseInt(match[0], 10) * 4 : 4;
    } else if (durLower.includes("day")) {
      const match = durLower.match(/\d+/);
      const days = match ? parseInt(match[0], 10) : 5;
      weeksSpan = Math.max(1, Math.round(days / 7));
    }
    const weekEnd = weekStart + weeksSpan - 1;
    cumulativeWeek = weekEnd + 1;

    // Match skills to DB IDs
    const matchedSkillIds = [];
    (phase.skills || []).forEach((sName) => {
      const norm = normalizeSkill(sName);
      const found = allDbSkills.find(
        (ds) =>
          normalizeSkill(ds.name) === norm ||
          normalizeSkill(ds.slug) === norm
      );
      if (found) matchedSkillIds.push(found._id);
    });

    return {
      weekStart,
      weekEnd,
      title: phase.title,
      description: phase.why || `Focus on mastering ${phase.skills?.join(", ") || phase.title}`,
      topics: phase.topics || phase.skills || [],
      skills: matchedSkillIds,
      estimatedHours: phase.estimatedHours || 15,
      priority: phase.priority === "high" ? 1 : phase.priority === "medium" ? 2 : 3,
      status: "Not Started",
      completed: false
    };
  });

  const totalWeeks = Math.min(24, Math.max(items[items.length - 1]?.weekEnd || 8, 4));

  return {
    user: userId,
    role: role._id,
    targetRole: role.name || targetRole,
    title: `Personalized Learning Path for ${role.name || targetRole}`,
    description: `Custom roadmap tailored to your existing skills and targeted to close your skill gap for ${role.name || targetRole}.`,
    estimatedTotalDuration: generated.estimatedTotalDuration || `${totalWeeks} weeks`,
    alreadyKnownSkills: generated.alreadyKnownSkills || strongSkills,
    missingSkills: generated.missingSkills || missingSkills,
    phases: generated.phases.map((p, i) => ({
      phaseNumber: p.phaseNumber || i + 1,
      title: p.title,
      duration: p.duration,
      skills: p.skills || [],
      priority: p.priority || "high",
      why: p.why || "",
      topics: p.topics || [],
      estimatedHours: p.estimatedHours || 15
    })),
    totalWeeks,
    items,
    generatedAt: new Date()
  };
};

export const updateRoadmapItemStatus = async (
  roadmapId,
  itemId,
  status
) => {
  // Utility for status updates if needed
  const Roadmap = (await import("../models/Roadmap.js")).default;
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new Error("Roadmap not found");

  const item = roadmap.items.id(itemId);
  if (!item) throw new Error("Roadmap item not found");

  item.status = status;
  item.completed = status === "Completed";
  item.completedAt = status === "Completed" ? new Date() : null;

  const completedCount = roadmap.items.filter((i) => i.completed).length;
  roadmap.completionPercentage = Math.round((completedCount / roadmap.items.length) * 100);

  await roadmap.save();
  return roadmap;
};