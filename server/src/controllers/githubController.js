import GithubAnalysis from "../models/GithubAnalysis.js";
import User from "../models/User.js";

import {
  collectGithubData,
  analyzeGithubWithGemini
} from "../services/githubService.js";

import {
  recalculateAndSaveSkillGap
} from "../services/skillGapService.js";

// ============================================
// ANALYZE GITHUB
// ============================================

export const analyzeGithub = async (
  req,
  res,
  next
) => {

  try {

    const {
      username,
      targetRole
    } = req.body;


    const cleanUsername =
      String(username || "")
        .trim()
        .replace(/^@/, "");


    if (!cleanUsername) {

      return res.status(400).json({
        success: false,
        message:
          "GitHub username is required."
      });

    }

    let roleToUse = String(targetRole || "").trim();
    if (!roleToUse) {
      const user = await User.findById(req.user._id).populate("targetRole").lean();
      roleToUse =
        user?.targetRole?.slug ||
        user?.targetRole?.name ||
        user?.customTargetRole ||
        "DevOps Engineer";
    }


    console.log(
      `Starting GitHub analysis for: ${cleanUsername}`
    );


    // ============================================
    // GET GITHUB DATA
    // ============================================

    const githubData =
      await collectGithubData(
        cleanUsername
      );


    console.log(
      `GitHub data collected for: ${cleanUsername}`
    );


    // ============================================
    // GEMINI ANALYSIS
    // ============================================

    const analysis =
      await analyzeGithubWithGemini({
        githubData,
        targetRole: roleToUse
      });


    console.log(
      `GitHub AI analysis completed for: ${cleanUsername}`
    );


    // ============================================
    // SAVE TO MONGODB
    // ============================================

    const savedAnalysis =
      await GithubAnalysis.create({

        user: req.user._id,

        githubUsername:
  githubData.profile.login,
        profileUrl:
          githubData.profile.profileUrl,

        avatarUrl:
          githubData.profile.avatarUrl,

        name:
          githubData.profile.name,

        bio:
          githubData.profile.bio,

        publicRepositories:
          githubData.profile.publicRepositories,

        followers:
          githubData.profile.followers,

        following:
          githubData.profile.following,

        repositories:
          githubData.repositories,

        languages:
          githubData.languages,

        recentActivity:
          githubData.recentActivity,

        ...analysis
      });


    console.log(
      "GitHub analysis saved:",
      savedAnalysis._id
    );

    // Automatically recalculate skill gap using My Skills + Resume + GitHub
    const updatedSkillGap = await recalculateAndSaveSkillGap(
      req.user._id,
      roleToUse
    );

    return res.status(201).json({

      success: true,

      message:
        "GitHub profile analyzed successfully.",

      data:
        savedAnalysis,

      skillGap:
        updatedSkillGap
    });


  } catch (error) {

    console.error(
      "GitHub analysis error:",
      error
    );


    if (error?.status === 404) {

      return res.status(404).json({
        success: false,
        message:
          "GitHub username not found."
      });

    }


    if (error?.status === 403) {

      return res.status(429).json({
        success: false,
        message:
          "GitHub API rate limit reached. Please try again later."
      });

    }


    next(error);
  }
};


// ============================================
// GET LATEST ANALYSIS
// ============================================

export const getLatestGithubAnalysis =
  async (
    req,
    res,
    next
  ) => {

    try {

      const analysis =
        await GithubAnalysis
          .findOne({
            user: req.user._id
          })
          .sort({
            createdAt: -1
          });


      return res.status(200).json({

        success: true,

        data:
          analysis
      });


    } catch (error) {

      next(error);

    }
  };


// ============================================
// GET HISTORY
// ============================================

export const getGithubAnalysisHistory =
  async (
    req,
    res,
    next
  ) => {

    try {

      const analyses =
        await GithubAnalysis
          .find({
            user: req.user._id
          })
          .sort({
            createdAt: -1
          })
          .limit(20);


      return res.status(200).json({

        success: true,

        data:
          analyses
      });


    } catch (error) {

      next(error);

    }
  };