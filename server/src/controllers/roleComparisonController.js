import Role from "../models/Role.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import asyncHandler from "../utils/asyncHandler.js";

export const compareRoles = asyncHandler(async (req, res) => {
  const { role1, role2 } = req.query;

  if (!role1 || !role2) {
    return res.status(400).json({
      success: false,
      message: "role1 and role2 are required"
    });
  }

  if (role1 === role2) {
    return res.status(400).json({
      success: false,
      message: "Please select two different roles"
    });
  }

  const roles = await Role.find({
    slug: {
      $in: [role1, role2]
    }
  });

  if (roles.length !== 2) {
    return res.status(404).json({
      success: false,
      message: "One or both roles were not found"
    });
  }

  const first = roles.find((role) => role.slug === role1);
  const second = roles.find((role) => role.slug === role2);

  const firstSkills = new Set(first.skills || []);
  const secondSkills = new Set(second.skills || []);

  const commonSkills = [...firstSkills].filter((skill) =>
    secondSkills.has(skill)
  );

  const onlyFirst = [...firstSkills].filter(
    (skill) => !secondSkills.has(skill)
  );

  const onlySecond = [...secondSkills].filter(
    (skill) => !firstSkills.has(skill)
  );

  let studentGap = null;

  if (req.user) {
    studentGap = await SkillGapAnalysis.findOne({
      user: req.user._id,
      targetRole: first.slug
    }).sort({ createdAt: -1 });
  }

  res.json({
    success: true,
    data: {
      roles: [first, second],
      commonSkills,
      onlyFirst,
      onlySecond,
      studentGap
    }
  });
});