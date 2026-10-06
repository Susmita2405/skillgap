import SkillGapAnalysis from "../models/SkillGapAnalysis.js";

import {
  analyzeSkillGap,
  recalculateAndSaveSkillGap
} from "../services/skillGapService.js";

/*
|--------------------------------------------------------------------------
| GENERATE / REFRESH SKILL GAP
|--------------------------------------------------------------------------
*/

export const generateSkillGapAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    const targetRole = String(req.body.targetRole || "").trim();

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    const savedAnalysis = await recalculateAndSaveSkillGap(
      userId,
      targetRole
    );

    return res.status(200).json({
      success: true,
      message: "Skill-gap analysis updated successfully.",
      data: savedAnalysis
    });
  } catch (error) {
    console.error("Skill gap generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to generate skill-gap analysis"
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET LATEST SKILL GAP
|--------------------------------------------------------------------------
*/

export const getLatestSkillGap = async (req, res) => {
  try {
    let analysis = await SkillGapAnalysis.findOne({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .lean();

    if (!analysis) {
      // If not yet generated, attempt to recalculate and save
      analysis = await recalculateAndSaveSkillGap(req.user._id);
    }

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "No skill-gap analysis found"
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Get latest skill gap error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get skill-gap analysis"
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SKILL GAP FOR ROLE
|--------------------------------------------------------------------------
|
| Recalculates and saves so it always reflects the latest My Skills /
| Resume / GitHub evidence and matches Dashboard.
|--------------------------------------------------------------------------
*/

export const getSkillGapAnalysis = async (req, res) => {
  try {
    const role = String(req.query.role || "").trim();

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    const savedAnalysis = await recalculateAndSaveSkillGap(
      req.user._id,
      role
    );

    return res.status(200).json({
      success: true,
      data: savedAnalysis
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to analyze skill gap"
    });
  }
};

/*
|--------------------------------------------------------------------------
| HISTORY
|--------------------------------------------------------------------------
*/

export const getMySkillGapHistory = async (req, res) => {
  try {
    const analyses = await SkillGapAnalysis.find({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error("Get skill gap history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get skill-gap history"
    });
  }
};