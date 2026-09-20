import Project from "../models/Project.js";

import ProjectRecommendation from "../models/ProjectRecommendation.js";

import {
  generateProjectRecommendations
} from "../services/projectRecommendationService.js";

export const getProjects = async (
  req,
  res
) => {
  const projects =
    await Project.find({
      isActive: true
    }).sort({
      title: 1
    });

  res.status(200).json({
    success: true,
    data: projects
  });
};

export const getProjectRecommendations =
  async (req, res) => {
    try {
      const {
        targetRole
      } = req.body;

      if (!targetRole) {
        return res.status(400).json({
          success: false,
          message:
            "Target role is required"
        });
      }

      const recommendations =
        await generateProjectRecommendations(
          req.user._id,
          targetRole
        );

      const recommendationDocument =
        await ProjectRecommendation.create(
          {
            user: req.user._id,
            targetRole,
            recommendations:
              recommendations.map(
                (item) => ({
                  project:
                    item.project._id,

                  matchScore:
                    item.matchScore,

                  matchedSkills:
                    item.matchedSkills,

                  skillsToLearn:
                    item.skillsToLearn
                })
              )
          }
        );

      await recommendationDocument.populate(
        "recommendations.project"
      );

      res.status(201).json({
        success: true,
        data: recommendationDocument
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

export const getLatestRecommendations =
  async (req, res) => {
    const recommendations =
      await ProjectRecommendation.findOne({
        user: req.user._id
      })
        .sort({
          createdAt: -1
        })
        .populate(
          "recommendations.project"
        )
        .lean();

    if (!recommendations) {
      return res.status(404).json({
        success: false,
        message:
          "No project recommendations found"
      });
    }

    res.status(200).json({
      success: true,
      data: recommendations
    });
  };