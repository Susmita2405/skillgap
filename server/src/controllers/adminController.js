import User from "../models/User.js";
import Role from "../models/Role.js";
import Project from "../models/Project.js";
import Assessment from "../models/Assessment.js";
import Skill from "../models/Skill.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalRoles,
    totalProjects,
    totalSkills,
    totalAssessments,
    recentUsers
  ] = await Promise.all([
    User.countDocuments(),
    Role.countDocuments(),
    Project.countDocuments(),
    Skill.countDocuments(),
    Assessment.countDocuments(),

    User.find()
      .select("name email targetRole createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  res.json({
    success: true,
    data: {
      statistics: {
        totalUsers,
        totalRoles,
        totalProjects,
        totalSkills,
        totalAssessments
      },

      recentUsers
    }
  });
});