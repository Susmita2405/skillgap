import Activity from "../models/Activity.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getActivities = asyncHandler(
  async (req, res) => {
    const limit = Math.min(
      Number(req.query.limit) || 30,
      100
    );

    const activities = await Activity.find({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .limit(limit);

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  }
);