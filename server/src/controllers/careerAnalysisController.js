import { PDFParse } from "pdf-parse";

import CareerAnalysis from "../models/CareerAnalysis.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import GithubAnalysis from "../models/GithubAnalysis.js";
import User from "../models/User.js";

import {
  collectGithubData
} from "../services/githubService.js";

import {
  analyzeCareerProfileWithGemini
} from "../services/careerAnalysisService.js";

import {
  recalculateAndSaveSkillGap
} from "../services/skillGapService.js";


export const analyzeCareerProfile =
  async (req, res, next) => {

    console.log("");
    console.log("==============================================");
    console.log("🚀 CAREER ANALYSIS REQUEST STARTED");
    console.log("==============================================");

    try {

      // ==================================================
      // CHECKPOINT 1
      // REQUEST DATA
      // ==================================================

      console.log("CHECKPOINT 1: Reading request data...");

      const {
        targetRole,
        githubUsername
      } = req.body || {};

      console.log("Target Role:", targetRole);
      console.log("GitHub Username:", githubUsername);
      console.log(
        "User ID:",
        req.user?._id
      );

      console.log(
        "File received:",
        req.file
          ? {
              name: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype
            }
          : "NO FILE"
      );


      // ==================================================
      // CHECKPOINT 2
      // CHECK RESUME
      // ==================================================

      console.log("CHECKPOINT 2: Checking resume...");

      if (!req.file) {
        console.error(
          "❌ CHECKPOINT 2 FAILED: No resume file"
        );

        return res.status(400).json({
          success: false,
          message:
            "Please upload your resume PDF."
        });
      }

      if (
        req.file.mimetype !==
        "application/pdf"
      ) {
        console.error(
          "❌ CHECKPOINT 2 FAILED: File is not PDF"
        );

        return res.status(400).json({
          success: false,
          message:
            "Only PDF resumes are supported."
        });
      }

      console.log(
        "✅ CHECKPOINT 2 PASSED: Resume received"
      );


      // ==================================================
      // CHECKPOINT 3
      // DETERMINE TARGET ROLE
      // ==================================================

      console.log(
        "CHECKPOINT 3: Determining target role..."
      );

      let roleToUse =
        (targetRole || "").trim();

      if (!roleToUse) {

        console.log(
          "No target role supplied. Reading role from user..."
        );

        const userDoc =
          await User.findById(
            req.user._id
          )
            .populate("targetRole")
            .lean();

        roleToUse =
          userDoc?.targetRole?.slug ||
          userDoc?.targetRole?.name ||
          userDoc?.customTargetRole ||
          "DevOps Engineer";
      }

      console.log(
        "✅ Target role:",
        roleToUse
      );


      // ==================================================
      // CHECKPOINT 4
      // CHECK GITHUB USERNAME
      // ==================================================

      console.log(
        "CHECKPOINT 4: Checking GitHub username..."
      );

      if (
        !githubUsername ||
        !githubUsername.trim()
      ) {

        console.error(
          "❌ CHECKPOINT 4 FAILED: GitHub username missing"
        );

        return res.status(400).json({
          success: false,
          message:
            "GitHub username is required."
        });
      }

      console.log(
        "✅ CHECKPOINT 4 PASSED: GitHub username:",
        githubUsername
      );


      // ==================================================
      // CHECKPOINT 5
      // EXTRACT RESUME TEXT
      // ==================================================

      console.log(
        "CHECKPOINT 5: Extracting resume text..."
      );

      const parser =
        new PDFParse({
          data: req.file.buffer
        });

      const pdfData =
        await parser.getText();

      await parser.destroy();

      const resumeText =
        pdfData.text?.trim() || "";

      console.log(
        "Resume text length:",
        resumeText.length
      );

      if (
        resumeText.length < 100
      ) {

        console.error(
          "❌ CHECKPOINT 5 FAILED: Resume text too short"
        );

        return res.status(400).json({
          success: false,
          message:
            "Could not extract enough text from the resume. Please upload a readable PDF."
        });
      }

      console.log(
        "✅ CHECKPOINT 5 PASSED: Resume text extracted"
      );


      // ==================================================
      // CHECKPOINT 6
      // COLLECT GITHUB DATA
      // ==================================================

      console.log(
        "CHECKPOINT 6: Collecting GitHub data..."
      );

      let githubData;

      try {

        githubData =
          await collectGithubData(
            githubUsername.trim()
          );

        console.log(
          "✅ CHECKPOINT 6 PASSED: GitHub data collected"
        );

        console.log(
          "GitHub username:",
          githubData.username
        );

        console.log(
          "Repositories:",
          githubData.repositories?.length || 0
        );

        console.log(
          "Languages:",
          githubData.languages?.length || 0
        );

        console.log(
          "Recent activity:",
          githubData.recentActivity?.length || 0
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 6 FAILED: GitHub collection error"
        );

        console.error(
          "GitHub error message:",
          error?.message
        );

        console.error(
          "GitHub error status:",
          error?.status
        );

        console.error(
          "GitHub error details:",
          error?.details
        );

        if (
          error?.status === 404
        ) {
          return res.status(404).json({
            success: false,
            message:
              "GitHub username not found."
          });
        }

        if (
          error?.status === 403
        ) {
          return res.status(429).json({
            success: false,
            message:
              "GitHub API rate limit reached. Please try again later."
          });
        }

        throw error;
      }


      // ==================================================
      // CHECKPOINT 7
      // GEMINI ANALYSIS
      // ==================================================

      console.log(
        "CHECKPOINT 7: Calling Gemini..."
      );

      console.log(
        "Gemini target role:",
        roleToUse
      );

      console.log(
        "Gemini resume length:",
        resumeText.length
      );

      console.log(
        "Gemini GitHub repositories:",
        githubData.repositories?.length || 0
      );

      let analysis;

      try {

        analysis =
          await analyzeCareerProfileWithGemini({
            targetRole:
              roleToUse,

            resumeText:
              resumeText,

            githubData:
              githubData
          });

        console.log(
          "✅ CHECKPOINT 7 PASSED: Gemini analysis completed"
        );

        console.log(
          "Gemini overall score:",
          analysis?.overallScore
        );

        console.log(
          "Gemini resume score:",
          analysis?.resumeScore
        );

        console.log(
          "Gemini GitHub score:",
          analysis?.githubScore
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 7 FAILED: Gemini analysis error"
        );

        console.error(
          "Gemini error message:",
          error?.message
        );

        console.error(
          "Gemini error status:",
          error?.status
        );

        console.error(
          "Gemini response status:",
          error?.response?.status
        );

        console.error(
          "Gemini details:",
          error?.details
        );

        console.error(
          "Gemini stack:",
          error?.stack
        );

        throw error;
      }


      // ==================================================
      // CHECKPOINT 8
      // SAVE CAREER ANALYSIS
      // ==================================================

      console.log(
        "CHECKPOINT 8: Saving CareerAnalysis..."
      );

      let savedAnalysis;

      try {

        savedAnalysis =
          await CareerAnalysis.create({

            user:
              req.user._id,

            targetRole:
              roleToUse,

            fileName:
              req.file.originalname,

            githubUsername:
              githubData.username,

            githubProfileUrl:
              githubData.profile.profileUrl,

            githubName:
              githubData.profile.name,

            githubAvatarUrl:
              githubData.profile.avatarUrl,

            overallScore:
              analysis.overallScore,

            resumeScore:
              analysis.resumeScore,

            githubScore:
              analysis.githubScore,

            projectScore:
              analysis.projectScore,

            summary:
              analysis.summary,

            detectedSkills:
              analysis.detectedSkills,

            verifiedSkills:
              analysis.verifiedSkills,

            missingSkills:
              analysis.missingSkills,

            skillGaps:
              analysis.skillGaps,

            resumeStrengths:
              analysis.resumeStrengths,

            resumeWeaknesses:
              analysis.resumeWeaknesses,

            githubStrengths:
              analysis.githubStrengths,

            githubWeaknesses:
              analysis.githubWeaknesses,

            recommendations:
              analysis.recommendations,

            projectSuggestions:
              analysis.projectSuggestions,

            nextSteps:
              analysis.nextSteps,

            resumeSuggestions:
              analysis.resumeSuggestions,

            githubSuggestions:
              analysis.githubSuggestions,

            technologies:
              analysis.technologies,

            githubRepositories:
              githubData.repositories,

            githubLanguages:
              githubData.languages
          });

        console.log(
          "✅ CHECKPOINT 8 PASSED: CareerAnalysis saved"
        );

        console.log(
          "CareerAnalysis ID:",
          savedAnalysis._id
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 8 FAILED: CareerAnalysis save error"
        );

        console.error(
          "Save error message:",
          error?.message
        );

        console.error(
          "Save error name:",
          error?.name
        );

        console.error(
          "Save error details:",
          error?.errors
        );

        throw error;
      }


      // ==================================================
      // CHECKPOINT 9
      // SAVE RESUME ANALYSIS
      // ==================================================

      console.log(
        "CHECKPOINT 9: Saving ResumeAnalysis..."
      );

      try {

        await ResumeAnalysis.create({

          user:
            req.user._id,

          fileName:
            req.file.originalname,

          fileSize:
            req.file.size,

          targetRole:
            roleToUse,

          extractedText:
            resumeText,

          detectedSkills:
            analysis.detectedSkills || [],

          verifiedSkills:
            analysis.verifiedSkills || [],

          resumeScore:
            analysis.resumeScore || 0,

          summary:
            analysis.summary || "",

          resumeStrengths:
            analysis.resumeStrengths || [],

          resumeWeaknesses:
            analysis.resumeWeaknesses || []
        });

        console.log(
          "✅ CHECKPOINT 9 PASSED: ResumeAnalysis saved"
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 9 FAILED: ResumeAnalysis save error"
        );

        console.error(
          "ResumeAnalysis error:",
          error?.message
        );

        console.error(
          "ResumeAnalysis details:",
          error?.errors
        );

        throw error;
      }


      // ==================================================
      // CHECKPOINT 10
      // SAVE GITHUB ANALYSIS
      // ==================================================

      console.log(
        "CHECKPOINT 10: Saving GithubAnalysis..."
      );

      try {

        await GithubAnalysis.create({

          user:
            req.user._id,

          githubUsername:
            githubData.username,

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

          githubScore:
            analysis.githubScore || 0,

          githubStrengths:
            analysis.githubStrengths || [],

          githubWeaknesses:
            analysis.githubWeaknesses || [],

          verifiedSkills:
            analysis.verifiedSkills || [],

          detectedSkills:
            analysis.detectedSkills || []
        });

        console.log(
          "✅ CHECKPOINT 10 PASSED: GithubAnalysis saved"
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 10 FAILED: GithubAnalysis save error"
        );

        console.error(
          "GithubAnalysis error:",
          error?.message
        );

        console.error(
          "GithubAnalysis details:",
          error?.errors
        );

        throw error;
      }


      // ==================================================
      // CHECKPOINT 11
      // SKILL GAP
      // ==================================================

      console.log(
        "CHECKPOINT 11: Recalculating skill gap..."
      );

      let updatedSkillGap;

      try {

        updatedSkillGap =
          await recalculateAndSaveSkillGap(
            req.user._id,
            roleToUse
          );

        console.log(
          "✅ CHECKPOINT 11 PASSED: Skill gap updated"
        );

      } catch (error) {

        console.error(
          "❌ CHECKPOINT 11 FAILED: Skill gap error"
        );

        console.error(
          "Skill gap error:",
          error?.message
        );

        console.error(
          "Skill gap details:",
          error?.stack
        );

        throw error;
      }


      // ==================================================
      // CHECKPOINT 12
      // SUCCESS RESPONSE
      // ==================================================

      console.log(
        "=============================================="
      );

      console.log(
        "🎉 CHECKPOINT 12 PASSED"
      );

      console.log(
        "🎉 COMPLETE CAREER ANALYSIS SUCCESSFUL"
      );

      console.log(
        "=============================================="
      );

      return res.status(201).json({

        success:
          true,

        message:
          "Resume and GitHub analysis completed successfully.",

        data:
          savedAnalysis,

        skillGap:
          updatedSkillGap
      });

    } catch (error) {

      // ==================================================
      // FINAL ERROR
      // ==================================================

      console.error("");
      console.error(
        "=============================================="
      );

      console.error(
        "❌❌❌ COMBINED CAREER ANALYSIS FAILED ❌❌❌"
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Name:",
        error?.name
      );

      console.error(
        "Status:",
        error?.status
      );

      console.error(
        "Response Status:",
        error?.response?.status
      );

      console.error(
        "Details:",
        error?.details
      );

      console.error(
        "Stack:",
        error?.stack
      );

      console.error(
        "=============================================="
      );

      next(error);
    }
  };


export const getLatestCareerAnalysis =
  async (req, res, next) => {

    try {

      const analysis =
        await CareerAnalysis.findOne({
          user:
            req.user._id
        })
          .sort({
            createdAt: -1
          });

      return res.json({
        success:
          true,

        data:
          analysis
      });

    } catch (error) {

      next(error);
    }
  };


export const getCareerAnalysisHistory =
  async (req, res, next) => {

    try {

      const analyses =
        await CareerAnalysis.find({
          user:
            req.user._id
        })
          .sort({
            createdAt: -1
          })
          .limit(20);

      return res.json({

        success:
          true,

        data:
          analyses
      });

    } catch (error) {

      next(error);
    }
  }; 