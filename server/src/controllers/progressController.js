import Progress from "../models/Progress.js";

import {
  createActivity
} from "../services/activityService.js";

const calculateOverallProgress = (
  progress
) => {
  const skillProgress =
    progress.skills.length === 0
      ? 0
      : progress.skills.reduce(
          (total, skill) =>
            total + skill.progress,
          0
        ) / progress.skills.length;

  const projectProgress =
    progress.projects.length === 0
      ? 0
      : progress.projects.reduce(
          (total, project) =>
            total + project.progress,
          0
        ) / progress.projects.length;

  const roadmapProgress =
    progress.roadmapProgress || 0;

  return Math.round(
    skillProgress * 0.3 +
      projectProgress * 0.3 +
      roadmapProgress * 0.4
  );
};

export const getProgress =
  async (req, res) => {
    let progress =
      await Progress.findOne({
        user: req.user._id
      }).populate(
        "projects.project"
      );

    if (!progress) {
      progress =
        await Progress.create({
          user: req.user._id
        });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  };

export const updateSkillProgress =
  async (req, res) => {
    const {
      skillSlug
    } = req.params;

    const {
      progress: progressValue
    } = req.body;

    if (
      typeof progressValue !==
        "number" ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100"
      });
    }

    let progress =
      await Progress.findOne({
        user: req.user._id
      });

    if (!progress) {
      progress =
        await Progress.create({
          user: req.user._id
        });
    }

    const existingSkill =
      progress.skills.find(
        (skill) =>
          skill.skillSlug ===
          skillSlug
      );

    if (existingSkill) {
      existingSkill.progress =
        progressValue;
    } else {
      progress.skills.push({
        skillSlug,
        progress: progressValue
      });
    }

    progress.overallProgress =
      calculateOverallProgress(
        progress
      );

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress
    });
  };

export const updateProjectProgress =
  async (req, res) => {
    const {
      projectId
    } = req.params;

    const {
      progress: progressValue,
      status
    } = req.body;

    if (
      typeof progressValue !==
        "number" ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100"
      });
    }

    let progress =
      await Progress.findOne({
        user: req.user._id
      });

    if (!progress) {
      progress =
        await Progress.create({
          user: req.user._id
        });
    }

    const existingProject =
      progress.projects.find(
        (project) =>
          project.project.toString() ===
          projectId
      );

    if (existingProject) {
      existingProject.progress =
        progressValue;

      if (status) {
        existingProject.status =
          status;
      }
    } else {
      progress.projects.push({
        project: projectId,
        progress: progressValue,
        status:
          status || "In Progress"
      });
    }

    progress.overallProgress =
      calculateOverallProgress(
        progress
      );

    await progress.save();

    await progress.populate(
      "projects.project"
    );

    res.status(200).json({
      success: true,
      data: progress
    });
  };

export const updateRoadmapProgress =
  async (req, res) => {
    const {
      progress: progressValue
    } = req.body;

    if (
      typeof progressValue !==
        "number" ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100"
      });
    }

    let progress =
      await Progress.findOne({
        user: req.user._id
      });

    if (!progress) {
      progress =
        await Progress.create({
          user: req.user._id
        });
    }

    progress.roadmapProgress =
      progressValue;

    progress.overallProgress =
      calculateOverallProgress(
        progress
      );

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress
    });
  };