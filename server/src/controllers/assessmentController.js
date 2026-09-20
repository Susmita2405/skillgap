import Assessment from "../models/Assessment.js";
import Role from "../models/Role.js";
import {
  createActivity
} from "../services/activityService.js"; 

import {
  getQuestionsForSkills,
  calculateSkillResult,
  getAssessmentSkillsForCustomRole
} from "../services/assessmentService.js";

export const getAssessmentQuestions = async (req, res) => {
  try {
    const { roleSlug } = req.params;

    const requestedRole = decodeURIComponent(roleSlug)
      .trim();

    if (!requestedRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    /*
     * First try predefined Role
     */

    const role = await Role.findOne({
      slug: requestedRole,
      isActive: true
    });

    let roleName;
    let skills;

    if (role) {
      roleName = role.name;

      skills = role.skills.map(
        (skill) => skill.slug
      );
    } else {
      /*
       * Custom role
       */

      roleName = requestedRole;

      skills = getAssessmentSkillsForCustomRole(
        requestedRole
      );
    }

    const questions = getQuestionsForSkills(skills);

    if (!questions.length) {
      return res.status(400).json({
        success: false,
        message: "No assessment questions available for this role"
      });
    }

    /*
     * NEVER send answers to frontend
     */

    const safeQuestions = questions.map(
      ({ answer, ...question }) => question
    );

    return res.status(200).json({
      success: true,

      data: {
        role: {
          name: roleName,
          slug: role?.slug || requestedRole
        },

        skills,

        questions: safeQuestions
      }
    });

  } catch (error) {
    console.error(
      "Get assessment questions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment"
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      targetRole,
      answers
    } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required"
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array"
      });
    }

    const requestedRole = String(targetRole)
      .trim();

    /*
     * Find predefined role
     */

    const role = await Role.findOne({
      slug: requestedRole,
      isActive: true
    });

    let skillSlugs;

    if (role) {
      skillSlugs = role.skills.map(
        (skill) => skill.slug
      );
    } else {
      /*
       * Custom role
       */

      skillSlugs =
        getAssessmentSkillsForCustomRole(
          requestedRole
        );
    }

    /*
     * Validate questions
     */

    const availableQuestions =
      getQuestionsForSkills(skillSlugs);

    const validQuestionIds =
      new Set(
        availableQuestions.map(
          (question) => question.id
        )
      );

    const invalidAnswer = answers.find(
      (answer) =>
        !validQuestionIds.has(answer.questionId)
    );

    if (invalidAnswer) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment question"
      });
    }

    /*
     * Calculate skill results
     */

    const results = skillSlugs.map(
      (skillSlug) =>
        calculateSkillResult(
          skillSlug,
          answers
        )
    );

    const totalQuestions =
      results.reduce(
        (total, result) =>
          total + result.totalQuestions,
        0
      );

    const totalCorrect =
      results.reduce(
        (total, result) =>
          total + result.correctAnswers,
        0
      );

    const overallScore =
      totalQuestions === 0
        ? 0
        : Math.round(
            (totalCorrect /
              totalQuestions) *
              100
          );

    /*
     * Save assessment
     */

    const assessment =
      await Assessment.create({
        user: userId,

        targetRole: requestedRole,

        skills: skillSlugs,

        answers: answers.map((answer) => ({
          skillSlug: answer.skillSlug,
          questionId: answer.questionId,
          answer: answer.answer
        })),

        results,

        overallScore,

        completed: true
      });

    return res.status(201).json({
      success: true,

      message:
        "Assessment completed successfully",

      data: assessment
    });

  } catch (error) {
    console.error(
      "Submit assessment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit assessment"
    });
  }
};

export const getMyAssessments = async (req, res) => {
  const assessments = await Assessment.find({
    user: req.user._id
  })
    .sort({
      createdAt: -1
    })
    .lean();

  res.status(200).json({
    success: true,
    data: assessments
  });
};

export const getLatestAssessment = async (
  req,
  res
) => {
  const assessment = await Assessment.findOne({
    user: req.user._id
  })
    .sort({
      createdAt: -1
    })
    .lean();

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: "No assessment found"
    });
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
};