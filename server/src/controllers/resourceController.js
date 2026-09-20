import LearningResource from "../models/LearningResource.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getResources = asyncHandler(
  async (req, res) => {
    const {
      skill,
      type,
      difficulty,
      search
    } = req.query;

    const query = {
      isActive: true
    };

    if (skill) {
      query.skillSlug = skill;
    }

    if (type) {
      query.type = type;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search?.trim()) {
      query.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          provider: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    const resources =
      await LearningResource.find(query)
        .sort({
          createdAt: -1
        })
        .limit(100);

    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  }
);

export const getRecommendedResources =
  asyncHandler(async (req, res) => {
    const analysis =
      await SkillGapAnalysis.findOne({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    if (!analysis) {
      return res.json({
        success: true,
        data: []
      });
    }

    const missingSkills =
      analysis.skills
        .filter(
          (skill) =>
            skill.status === "Missing" ||
            skill.status === "Moderate"
        )
        .sort(
          (a, b) =>
            (b.priority || 0) -
            (a.priority || 0)
        );

    const skillSlugs =
      missingSkills.map(
        (skill) => skill.skillSlug
      );

    const resources =
      await LearningResource.find({
        isActive: true,
        skillSlug: {
          $in: skillSlugs
        }
      })
        .sort({
          estimatedHours: 1
        })
        .limit(30);

    const grouped =
      skillSlugs.map((slug) => ({
        skillSlug: slug,
        resources: resources.filter(
          (resource) =>
            resource.skillSlug === slug
        )
      }));

    res.json({
      success: true,
      data: grouped
    });
  });