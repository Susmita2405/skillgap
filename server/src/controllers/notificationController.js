import Notification from "../models/Notification.js";

import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications =
  asyncHandler(async (req, res) => {
    const notifications =
      await Notification.find({
        user: req.user._id
      })
        .sort({
          createdAt: -1
        })
        .limit(50);

    const unread =
      notifications.filter(
        (notification) =>
          !notification.read
      ).length;

    res.json({
      success: true,
      data: {
        notifications,
        unread
      }
    });
  });

export const markAsRead =
  asyncHandler(async (req, res) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id
        },
        {
          read: true
        },
        {
          new: true
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      data: notification
    });
  });

export const markAllAsRead =
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      {
        user: req.user._id,
        read: false
      },
      {
        read: true
      }
    );

    res.json({
      success: true,
      message:
        "All notifications marked as read"
    });
  });