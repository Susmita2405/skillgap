import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import Roadmap from "../models/Roadmap.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";
import Progress from "../models/Progress.js";

export const getDashboard =
  async (req, res) => {
    const userId = req.user._id;

    const user =
      await User.findById(userId)
        .select(
          "-password"
        )
        .lean();

    const latestAssessment =
      await Assessment.findOne({
        user: userId
      })
        .sort({
          createdAt: -1
        })
        .lean();

    const latestSkillGap =
      await SkillGapAnalysis.findOne({
        user: userId
      })
        .sort({
          createdAt: -1
        })
        .lean();

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
          "projects.project"
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