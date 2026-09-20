import Assessment from "../models/Assessment.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import Progress from "../models/Progress.js";
import Roadmap from "../models/Roadmap.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCareerAnalytics =
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
      assessment,
      gap,
      progress,
      roadmap
    ] = await Promise.all([
      Assessment.findOne({
        user: userId
      }).sort({
        createdAt: -1
      }),

      SkillGapAnalysis.findOne({
        user: userId
      }).sort({
        createdAt: -1
      }),

      Progress.findOne({
        user: userId
      }),

      Roadmap.findOne({
        user: userId
      }).sort({
        createdAt: -1
      })
    ]);

    const skills =
      gap?.skills || [];

    const strong =
      skills.filter(
        (skill) =>
          skill.status === "Strong"
      );

    const moderate =
      skills.filter(
        (skill) =>
          skill.status === "Moderate"
      );

    const missing =
      skills.filter(
        (skill) =>
          skill.status === "Missing"
      );

    const sortedGaps =
      [...skills]
        .sort(
          (a, b) =>
            (b.gap || 0) -
            (a.gap || 0)
        );

    const biggestGaps =
      sortedGaps.slice(0, 5);

    const strongestSkills =
      [...skills]
        .sort(
          (a, b) =>
            (b.studentScore || 0) -
            (a.studentScore || 0)
        )
        .slice(0, 5);

    const roadmapItems =
      roadmap?.items || [];

    const completedRoadmap =
      roadmapItems.filter(
        (item) =>
          item.status === "completed"
      ).length;

    const roadmapCompletion =
      roadmapItems.length
        ? Math.round(
            (completedRoadmap /
              roadmapItems.length) *
              100
          )
        : 0;

    const recommendations = [];

    if (missing.length > 0) {
      recommendations.push({
        type: "priority",
        title: "Focus on missing skills",
        description:
          `You currently have ${missing.length} skill gaps. Start with the highest-priority skill.`
      });
    }

    if (moderate.length > 0) {
      recommendations.push({
        type: "improvement",
        title: "Strengthen moderate skills",
        description:
          `You have ${moderate.length} partially developed skills that can improve your readiness quickly.`
      });
    }

    if (roadmapCompletion < 50) {
      recommendations.push({
        type: "roadmap",
        title: "Continue your roadmap",
        description:
          "Consistent roadmap progress will improve your career readiness."
      });
    }

    if (
      strong.length > 0 &&
      missing.length === 0
    ) {
      recommendations.push({
        type: "success",
        title: "You are in a strong position",
        description:
          "Your current skill profile covers the major requirements of your target role."
      });
    }

    res.json({
      success: true,

      data: {
        readinessScore:
          gap?.readinessScore || 0,

        overallProgress:
          progress?.overallProgress || 0,

        assessmentScore:
          assessment?.score || 0,

        skillDistribution: {
          strong: strong.length,
          moderate: moderate.length,
          missing: missing.length
        },

        biggestGaps,

        strongestSkills,

        roadmapCompletion,

        recommendations
      }
    });
  });

export const getAnalyticsChartData =
  asyncHandler(async (req, res) => {
    const gap =
      await SkillGapAnalysis.findOne({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    const progress =
      await Progress.findOne({
        user: req.user._id
      });

    const skills =
      gap?.skills || [];

    const distribution = [
      {
        name: "Strong",
        value: skills.filter(
          (skill) =>
            skill.status === "Strong"
        ).length
      },
      {
        name: "Moderate",
        value: skills.filter(
          (skill) =>
            skill.status === "Moderate"
        ).length
      },
      {
        name: "Missing",
        value: skills.filter(
          (skill) =>
            skill.status === "Missing"
        ).length
      }
    ];

    const skillProgress =
      (progress?.skills || [])
        .slice(0, 10)
        .map((skill) => ({
          name: skill.skillSlug,
          progress: skill.progress
        }));

    res.json({
      success: true,
      data: {
        distribution,
        skillProgress,
        overallProgress:
          progress?.overallProgress || 0,
        readinessScore:
          gap?.readinessScore || 0
      }
    });
  });