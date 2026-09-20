import Role from "../models/Role.js";
import Assessment from "../models/Assessment.js";
import UserSkill from "../models/UserSkill.js";

const getStatus = (score) => {
  if (score >= 80) {
    return "Strong";
  }

  if (score >= 50) {
    return "Moderate";
  }

  if (score > 0) {
    return "Weak";
  }

  return "Missing";
};

export const analyzeSkillGap = async (
  userId,
  targetRole
) => {
  const role = await Role.findOne({
    slug: targetRole,
    isActive: true
  }).lean();

  if (!role) {
    throw new Error("Target role not found");
  }

  const userSkills =
  await UserSkill.find({
    user: userId
  }).lean();

const userSkillMap = {};

for (const skill of userSkills) {
  userSkillMap[
    skill.normalizedName
  ] = skill;
}

  const latestAssessment =
    await Assessment.findOne({
      user: userId,
      targetRole
    })
      .sort({
        createdAt: -1
      })
      .lean();

  const assessmentScores = {};

  if (latestAssessment) {
    for (const result of latestAssessment.results) {
      assessmentScores[result.skillSlug] =
        result.score;
    }
  }

  const skillResults = role.skills.map(
    (roleSkill) => {
      const studentScore =
        assessmentScores[roleSkill.slug] || 0;

      const gap = Math.max(
        0,
        100 - studentScore
      );

      const status =
        getStatus(studentScore);

      return {
        skillSlug: roleSkill.slug,

        required:
          roleSkill.importance ===
          "required",

        priority:
          roleSkill.priority,

        studentScore,

        status,

        gap
      };
    }
  );

  const weightedTotal =
    skillResults.reduce(
      (total, skill) => {
        const weight =
          skill.required
            ? 1.5
            : 1;

        return (
          total +
          skill.studentScore * weight
        );
      },
      0
    );

  const totalWeight =
    skillResults.reduce(
      (total, skill) => {
        return (
          total +
          (skill.required ? 1.5 : 1)
        );
      },
      0
    );

  const readinessScore =
    totalWeight === 0
      ? 0
      : Math.round(
          weightedTotal / totalWeight
        );

  const strongSkills =
    skillResults
      .filter(
        (skill) =>
          skill.status === "Strong"
      )
      .map(
        (skill) => skill.skillSlug
      );

  const moderateSkills =
    skillResults
      .filter(
        (skill) =>
          skill.status === "Moderate"
      )
      .map(
        (skill) => skill.skillSlug
      );

  const weakSkills =
    skillResults
      .filter(
        (skill) =>
          skill.status === "Weak"
      )
      .map(
        (skill) => skill.skillSlug
      );

  const missingSkills =
    skillResults
      .filter(
        (skill) =>
          skill.status === "Missing"
      )
      .map(
        (skill) => skill.skillSlug
      );

  return {
    targetRole,
    readinessScore,
    strongSkills,
    moderateSkills,
    weakSkills,
    missingSkills,
    skills: skillResults
  };
};