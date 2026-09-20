import Roadmap from "../models/Roadmap.js";
import Role from "../models/Role.js";
import UserSkill from "../models/UserSkill.js";
import {
  generateRoadmap
} from "../services/roadmapService.js";


export const createRoadmap = async (
  req,
  res
) => {
  try {
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

    const roadmapData =
      await generateRoadmap(
        userId,
        targetRole
      );

    // Replace existing roadmap for this user
    const roadmap =
      await Roadmap.findOneAndUpdate(
        {
          user: userId
        },
        {
          user: userId,
          ...roadmapData
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Personalized roadmap generated successfully",
      data: roadmap
    });

  } catch (error) {
    console.error(
      "Create roadmap error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const getLatestRoadmap =
  async (req, res) => {
    try {
      const roadmap =
        await Roadmap.findOne({
          user: req.user._id
        })
          .populate("role")
          .populate("items.skills")
          .sort({
            createdAt: -1
          })
          .lean();

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "No roadmap found"
        });
      }

      return res.status(200).json({
        success: true,
        data: roadmap
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to load roadmap"
      });
    }
  };


export const getRoadmapByRole =
  async (req, res) => {
    try {
      const targetRole =
        req.params.targetRole;

      const roadmap =
        await Roadmap.findOne({
          user: req.user._id,
          targetRole
        })
          .populate("role")
          .populate("items.skills")
          .lean();

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: roadmap
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to load roadmap"
      });
    }
  };


export const updateRoadmapItem =
  async (req, res) => {
    try {
      const {
        roadmapId,
        itemId
      } = req.params;

      const {
        status
      } = req.body;

      const allowedStatuses = [
        "Not Started",
        "In Progress",
        "Completed"
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid roadmap status"
        });
      }

      const roadmap =
        await Roadmap.findOne({
          _id: roadmapId,
          user: req.user._id
        });

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message: "Roadmap not found"
        });
      }

      const item =
        roadmap.items.id(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Roadmap item not found"
        });
      }

      item.status = status;
      item.completed =
        status === "Completed";

      item.completedAt =
        status === "Completed"
          ? new Date()
          : null;

      const completed =
        roadmap.items.filter(
          (item) => item.completed
        ).length;

      roadmap.completionPercentage =
        roadmap.items.length === 0
          ? 0
          : Math.round(
              (completed /
                roadmap.items.length) *
                100
            );

      await roadmap.save();

      return res.status(200).json({
        success: true,
        message:
          "Roadmap progress updated",
        data: roadmap
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Unable to update roadmap"
      });
    }
  };