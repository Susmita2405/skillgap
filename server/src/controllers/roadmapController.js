import Roadmap from "../models/Roadmap.js";
import Role from "../models/Role.js";
import UserSkill from "../models/UserSkill.js";
import User from "../models/User.js";
import {
  generateRoadmap
} from "../services/roadmapService.js";


export const createRoadmap = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    let {
      targetRole
    } = req.body;

    if (!targetRole) {
      const user = await User.findById(userId).populate("targetRole").lean();
      targetRole =
        user?.targetRole?.name ||
        user?.targetRole?.slug ||
        user?.customTargetRole;
    }

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required to generate roadmap"
      });
    }

    const roadmapData =
      await generateRoadmap(
        userId,
        targetRole
      );

    // Replace existing roadmap for this user with race-condition safe upsert
    let roadmap;
    try {
      roadmap = await Roadmap.findOneAndUpdate(
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
      ).populate("role").populate("items.skills");
    } catch (dbErr) {
      if (dbErr.code === 11000 || dbErr.message?.includes("E11000") || dbErr.name === "MongoServerError") {
        roadmap = await Roadmap.findOneAndUpdate(
          { user: userId },
          { ...roadmapData },
          { new: true }
        ).populate("role").populate("items.skills");
      } else {
        throw dbErr;
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Personalized roadmap generated successfully with Gemini AI",
      data: roadmap
    });

  } catch (error) {
    console.error(
      "Create roadmap error:",
      error?.message || error
    );

    const isRawApiError =
      error?.message?.includes("{") ||
      error?.message?.includes("code") ||
      error?.message?.includes("models/");

    const clientMessage = isRawApiError
      ? "We couldn't generate your personalized roadmap right now. Please try again."
      : error.message || "We couldn't generate your personalized roadmap right now. Please try again.";

    return res.status(400).json({
      success: false,
      message: clientMessage
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
            updatedAt: -1,
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
      let targetRole = req.params.targetRole;

      if (!targetRole || targetRole === "null" || targetRole === "undefined") {
        const user = await User.findById(req.user._id).populate("targetRole").lean();
        targetRole =
          user?.targetRole?.name ||
          user?.targetRole?.slug ||
          user?.customTargetRole;
      }

      if (!targetRole) {
        return res.status(404).json({
          success: false,
          message: "No target role selected"
        });
      }

      const cleanRole = String(targetRole).trim();
      const normalizedRole = cleanRole.toLowerCase().replace(/[-_]/g, " ");

      let roadmap =
        await Roadmap.findOne({
          user: req.user._id,
          $or: [
            { targetRole: cleanRole },
            { targetRole: new RegExp(`^${cleanRole}$`, "i") },
            { targetRole: new RegExp(`^${normalizedRole}$`, "i") },
            { targetRole: new RegExp(`^${cleanRole.replace(/\s+/g, "-")}$`, "i") }
          ]
        })
          .populate("role")
          .populate("items.skills")
          .sort({
            updatedAt: -1
          })
          .lean();

      if (!roadmap) {
        try {
          const roadmapData = await generateRoadmap(req.user._id, cleanRole);
          try {
            roadmap = await Roadmap.findOneAndUpdate(
              {
                user: req.user._id
              },
              {
                user: req.user._id,
                ...roadmapData
              },
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
              }
            )
              .populate("role")
              .populate("items.skills")
              .lean();
          } catch (dbErr) {
            if (dbErr.code === 11000 || dbErr.message?.includes("E11000") || dbErr.name === "MongoServerError") {
              roadmap = await Roadmap.findOneAndUpdate(
                { user: req.user._id },
                { ...roadmapData },
                { new: true }
              )
                .populate("role")
                .populate("items.skills")
                .lean();
            } else {
              throw dbErr;
            }
          }
        } catch (autoErr) {
          console.warn("Auto-generating roadmap on getRoadmapByRole failed:", autoErr.message);
        }
      }

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