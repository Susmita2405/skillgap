import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import Roadmap from "../models/Roadmap.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";
import Progress from "../models/Progress.js";
import { recalculateAndSaveSkillGap } from "../services/skillGapService.js";

export const getDashboard =
  async (req, res) => {
    const userId = req.user._id;

    const user =
  await User.findById(userId)
    .select("-password")
    .populate("targetRole", "name slug title")
    .lean();

    const latestAssessment =
      await Assessment.findOne({
        user: userId
      })
        .sort({
          createdAt: -1
        })
        .lean();

    const currentRoleSlug =
      user?.targetRole?.slug ||
      (user?.targetRole?.name ? user.targetRole.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "") ||
      (user?.customTargetRole ? user.customTargetRole.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "");

    let latestSkillGap = null;

    if (currentRoleSlug) {
      latestSkillGap = await SkillGapAnalysis.findOne({
        user: userId,
        $or: [
          { targetRole: currentRoleSlug },
          { targetRole: user?.targetRole?.name },
          { targetRole: user?.customTargetRole }
        ]
      })
        .sort({
          updatedAt: -1
        })
        .lean();
    }

    if (!latestSkillGap) {
      latestSkillGap = await SkillGapAnalysis.findOne({
        user: userId
      })
        .sort({
          updatedAt: -1,
          createdAt: -1
        })
        .lean();
    }

    if (!latestSkillGap && (user?.targetRole || user?.customTargetRole)) {
      latestSkillGap = await recalculateAndSaveSkillGap(userId, currentRoleSlug || user?.targetRole?.name || user?.customTargetRole);
    }

    const latestRoadmap =
      await Roadmap.findOne({
        user: userId
      })
        .sort({
          createdAt: -1
        })
        .lean();

    const latestRecommendations =
      await ProjectRecommendation.findOne(
        {
          user: userId
        }
      )
        .sort({
          createdAt: -1
        })
        .populate(
          "recommendations.project"
        )
        .lean();

    let progress =
  await Progress.findOne({
    user: userId
  })
    .populate(
      "completedProjects.project"
    )
    .lean();

    if (!progress) {
      progress = {
        overallProgress: 0,
        roadmapProgress: 0,
        skills: [],
        projects: []
      };
    }

    const computedOverallProgress = Math.max(
      Number(latestSkillGap?.overallProgress || 0),
      Number(latestSkillGap?.readinessScore || 0),
      Number(progress?.overallProgress || 0)
    );

    progress.overallProgress = computedOverallProgress;

    if (latestSkillGap) {
      latestSkillGap.overallProgress = computedOverallProgress;
    }

    res.status(200).json({
      success: true,

      data: {
        user,

        assessment:
          latestAssessment,

        skillGap:
          latestSkillGap,

        roadmap:
          latestRoadmap,

        recommendations:
          latestRecommendations,

        progress
      }
    });
  };