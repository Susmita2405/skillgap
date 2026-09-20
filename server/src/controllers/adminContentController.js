import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import LearningResource from "../models/LearningResource.js";

import asyncHandler from "../utils/asyncHandler.js";

const models = {
  role: Role,
  skill: Skill,
  project: Project,
  resource: LearningResource
};

const getModel = (type) => {
  return models[type];
};

export const listContent =
  asyncHandler(async (req, res) => {
    const {
      type
    } = req.params;

    const Model = getModel(type);

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    const data =
      await Model.find()
        .sort({
          createdAt: -1
        })
        .limit(200);

    res.json({
      success: true,
      data
    });
  });

export const createContent =
  asyncHandler(async (req, res) => {
    const {
      type
    } = req.params;

    const Model = getModel(type);

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    const item =
      await Model.create(req.body);

    res.status(201).json({
      success: true,
      message: "Content created",
      data: item
    });
  });

export const updateContent =
  asyncHandler(async (req, res) => {
    const {
      type,
      id
    } = req.params;

    const Model = getModel(type);

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    const item =
      await Model.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }

    res.json({
      success: true,
      message: "Content updated",
      data: item
    });
  });

export const deleteContent =
  asyncHandler(async (req, res) => {
    const {
      type,
      id
    } = req.params;

    const Model = getModel(type);

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type"
      });
    }

    const item =
      await Model.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }

    res.json({
      success: true,
      message: "Content deleted"
    });
  });