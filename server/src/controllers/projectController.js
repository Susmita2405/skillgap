import Project from "../models/Project.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";
import ProjectSubmission from "../models/ProjectSubmission.js";
import User from "../models/User.js";

import { generateProjectRecommendations } from "../services/projectRecommendationService.js";
import { reviewProjectSubmission } from "../services/projectReviewService.js";

export const getProjects = async (req, res) => {
  const projects = await Project.find({
    isActive: true
  }).sort({
    title: 1
  });

  res.status(200).json({
    success: true,
    data: projects
  });
};

export const getProjectRecommendations = async (req, res) => {
  try {
    let { targetRole } = req.body;

    if (!targetRole) {
      const user = await User.findById(req.user._id).populate("targetRole").lean();
      targetRole =
        user?.targetRole?.name ||
        user?.targetRole?.slug ||
        user?.customTargetRole;
    }

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required for project recommendations"
      });
    }

    const recommendations = await generateProjectRecommendations(
      req.user._id,
      targetRole
    );

    let recommendationDocument;
    try {
      recommendationDocument = await ProjectRecommendation.findOneAndUpdate(
        { user: req.user._id },
        {
          user: req.user._id,
          targetRole,
          recommendations: recommendations.map((item) => ({
            project: item.project._id,
            matchScore: item.matchScore,
            matchedSkills: item.matchedSkills,
            skillsToLearn: item.skillsToLearn
          }))
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      ).populate("recommendations.project");
    } catch (dbErr) {
      if (dbErr.code === 11000 || dbErr.message?.includes("E11000") || dbErr.name === "MongoServerError") {
        recommendationDocument = await ProjectRecommendation.findOneAndUpdate(
          { user: req.user._id },
          {
            targetRole,
            recommendations: recommendations.map((item) => ({
              project: item.project._id,
              matchScore: item.matchScore,
              matchedSkills: item.matchedSkills,
              skillsToLearn: item.skillsToLearn
            }))
          },
          { new: true }
        ).populate("recommendations.project");
      } else {
        throw dbErr;
      }
    }

    res.status(201).json({
      success: true,
      data: recommendationDocument
    });
  } catch (error) {
    console.error("Project recommendation error:", error?.message || error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to generate project recommendations."
    });
  }
};

export const getLatestRecommendations = async (req, res) => {
  try {
    const recommendations = await ProjectRecommendation.findOne({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .populate("recommendations.project")
      .lean();

    if (!recommendations) {
      return res.status(404).json({
        success: false,
        message: "No project recommendations found"
      });
    }

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project recommendations"
    });
  }
};

export const submitProjectForReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId, githubUrl, submissionNotes, projectTitle: customTitle } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub repository URL is required."
      });
    }

    let project = null;
    let title = customTitle || "Hands-on Project";
    let requirements = [];
    let roleName = "";

    if (projectId) {
      project = await Project.findById(projectId).lean();
      if (project) {
        title = project.title;
        requirements = project.requirements || [];
      }
    }

    // Resolve user's target role
    const user = await User.findById(userId).populate("targetRole").lean();
    roleName =
      user?.targetRole?.name ||
      user?.targetRole?.slug ||
      user?.customTargetRole ||
      "Software Developer";

    // Run Gemini Project Review via safe GitHub static extraction
    const reviewResult = await reviewProjectSubmission({
      projectTitle: title,
      targetRole: roleName,
      requirements,
      githubUrl
    });

    // Save project submission
    const submission = await ProjectSubmission.create({
      user: userId,
      project: project ? project._id : null,
      projectTitle: title,
      targetRole: roleName,
      githubUrl,
      submissionNotes: submissionNotes || "",
      status: "reviewed",
      review: reviewResult
    });

    return res.status(201).json({
      success: true,
      message: "Project reviewed successfully by Gemini AI",
      data: submission
    });
  } catch (error) {
    console.error("Submit project review error:", error?.message || error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to review project submission."
    });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await ProjectSubmission.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate("project")
      .lean();

    res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user submissions"
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await ProjectSubmission.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate("project")
      .lean();

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch submission details"
    });
  }
};