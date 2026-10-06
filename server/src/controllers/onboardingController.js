import User from "../models/User.js";
import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import asyncHandler from "../utils/asyncHandler.js";
import { recalculateAndSaveSkillGap } from "../services/skillGapService.js";

export const getOnboardingData = asyncHandler(async (req, res) => {
  const [roles, skills] = await Promise.all([
    Role.find({ isActive: true })
      .select("name slug description category skills")
      .sort({ name: 1 }),

    Skill.find({ isActive: true })
      .select("name slug category description")
      .sort({ name: 1 })
  ]);

  res.json({
    success: true,
    data: {
      roles,
      skills
    }
  });
});

export const getOnboardingStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      completed: Boolean(user.onboardingCompleted),
      user: {
        name: user.name,
        targetRole: user.targetRole,
        education: user.education,
        experienceLevel: user.experienceLevel,
        currentSkills: user.currentSkills || []
      }
    }
  });
});

export const completeOnboarding = asyncHandler(async (req, res) => {
  const {
    name,
    education,
    targetRole,
    experienceLevel,
    currentSkills
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required"
    });
  }

  if (!targetRole) {
    return res.status(400).json({
      success: false,
      message: "Target role is required"
    });
  }

  const role = await Role.findOne({
    slug: targetRole,
    isActive: true
  });

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Invalid target role"
    });
  }

  let validSkills = [];

  if (Array.isArray(currentSkills) && currentSkills.length > 0) {
    validSkills = await Skill.find({
      slug: {
        $in: currentSkills
      },
      isActive: true
    }).select("slug");

    validSkills = validSkills.map((skill) => skill.slug);
  }

  const user = await User.findById(req.user._id);

  user.name = name.trim();
  user.education = education?.trim() || "";
  user.targetRole = targetRole;
  user.experienceLevel = experienceLevel || "beginner";
  user.currentSkills = validSkills;
  user.onboardingCompleted = true;

  await user.save();

  await recalculateAndSaveSkillGap(user._id, role.slug);

  res.json({
    success: true,
    message: "Onboarding completed successfully",
    data: {
      user
    }
  });
});