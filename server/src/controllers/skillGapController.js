import SkillGapAnalysis from "../models/SkillGapAnalysis.js";

import { analyzeSkillGap } from "../services/skillGapService.js";


export const generateSkillGapAnalysis =
  async (req, res) => {
    const userId = req.user._id;

    const {
      targetRole
    } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    try {
      const analysis =
        await analyzeSkillGap(
          userId,
          targetRole
        );

      const savedAnalysis =
        await SkillGapAnalysis.create({
          user: userId,
          ...analysis
        });

      res.status(201).json({
        success: true,
        message:
          "Skill-gap analysis generated successfully",
        data: savedAnalysis
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

export const getLatestSkillGap =
  async (req, res) => {
    const analysis =
      await SkillGapAnalysis.findOne({
        user: req.user._id
      })
        .sort({
          createdAt: -1
        })
        .lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "No skill-gap analysis found"
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  };

export const getMySkillGapHistory =
  async (req, res) => {
    const analyses =
      await SkillGapAnalysis.find({
        user: req.user._id
      })
        .sort({
          createdAt: -1
        })
        .lean();

    res.status(200).json({
      success: true,
      data: analyses
    });
  };

  export const getSkillGapAnalysis = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || !String(role).trim()) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    const analysis = await analyzeSkillGap({
      userId: req.user._id,
      targetRole: String(role).trim()
    });

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to analyze skill gap"
    });
  }
};