import bcrypt from "bcryptjs";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    targetRole,
    education,
    bio
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (targetRole !== undefined) {
    user.targetRole = targetRole;
  }

  if (education !== undefined) {
    user.education = education;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: user
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newPassword
  } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new password are required"
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must contain at least 6 characters"
    });
  }

  const user = await User.findById(req.user._id).select("+password");

  const validPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect"
    });
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully"
  });
});