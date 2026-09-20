import Project from "../models/Project.js";

import SkillGapAnalysis from "../models/SkillGapAnalysis.js";

export const generateProjectRecommendations =
  async (
    userId,
    targetRole
  ) => {
    const analysis =
      await SkillGapAnalysis.findOne({
        user: userId,
        targetRole
      })
        .sort({
          createdAt: -1
        })
        .lean();

    if (!analysis) {
      throw new Error(
        "Complete skill-gap analysis first"
      );
    }

    const projects =
      await Project.find({
        isActive: true
      }).lean();

    const skillMap = {};

    for (const skill of analysis.skills) {
      skillMap[skill.skillSlug] =
        skill;
    }

    const recommendations =
      projects
        .map((project) => {
          let totalWeight = 0;
          let matchedWeight = 0;

          const matchedSkills = [];
          const skillsToLearn = [];

          for (const skillSlug of project.skills) {
            const studentSkill =
              skillMap[skillSlug];

            const weight =
              studentSkill?.required
                ? 1.5
                : 1;

            totalWeight += weight;

            if (
              studentSkill &&
              studentSkill.studentScore >= 50
            ) {
              matchedWeight += weight;

              matchedSkills.push(
                skillSlug
              );
            } else {
              skillsToLearn.push(
                skillSlug
              );
            }
          }

          const matchScore =
            totalWeight === 0
              ? 0
              : Math.round(
                  (matchedWeight /
                    totalWeight) *
                    100
                );

          return {
            project,
            matchScore,
            matchedSkills,
            skillsToLearn
          };
        })
        .filter(
          (item) =>
            item.matchScore >= 20
        )
        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )
        .slice(0, 5);

    return recommendations;
  };