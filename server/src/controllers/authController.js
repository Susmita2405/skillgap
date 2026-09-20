import bcrypt from "bcryptjs";

import {
  generateToken,
  setAuthCookie,
  clearAuthCookie
} from "../utils/auth.js";

import User from "../models/User.js";
import Role from "../models/Role.js";


/* =========================================================
   REGISTER
   ========================================================= */

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user =
      await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });

    const safeUser =
      user.toObject();

    delete safeUser.password;

    const token =
      generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: safeUser
    });

  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};


/* =========================================================
   LOGIN
   ========================================================= */

export const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({
        email: normalizedEmail
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    user.lastLoginAt =
      new Date();

    await user.save();

    const token =
      generateToken(user._id);

    setAuthCookie(res, token);

    const safeUser =
      user.toObject();

    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


/* =========================================================
   LOGOUT
   ========================================================= */

export const logout = async (req, res) => {
  try {
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};


/* =========================================================
   GET CURRENT USER
   ========================================================= */

export const getCurrentUser = async (req, res) => {
  try {
    const user =
      await User.findById(req.user._id)
        .populate("targetRole")
        .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to get current user"
    });
  }
};


/* =========================================================
   UPDATE TARGET ROLE
   ========================================================= */

export const updateTargetRole = async (req, res) => {
  try {
    const { targetRole, customRole } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /*
     * ==========================================
     * PREDEFINED ROLE
     * ==========================================
     */

    if (targetRole) {
      const role = await Role.findById(targetRole);

      if (!role || !role.isActive) {
        return res.status(404).json({
          success: false,
          message: "Selected target role not found"
        });
      }

      user.targetRole = role._id;

      // Clear custom role because user selected a preset
      user.customTargetRole = "";

      await user.save();

      const updatedUser = await User.findById(user._id)
        .populate("targetRole")
        .select("-password");

      return res.status(200).json({
        success: true,
        message: "Target role updated successfully",
        user: updatedUser
      });
    }

    /*
     * ==========================================
     * CUSTOM ROLE
     * ==========================================
     */

    if (customRole) {
      const cleanedRole = customRole.trim();

      if (!cleanedRole) {
        return res.status(400).json({
          success: false,
          message: "Custom career role cannot be empty"
        });
      }

      if (cleanedRole.length > 80) {
        return res.status(400).json({
          success: false,
          message: "Custom career role must be 80 characters or less"
        });
      }

      // Remove predefined role
      user.targetRole = null;

      // Save custom role
      user.customTargetRole = cleanedRole;

      await user.save();

      const updatedUser = await User.findById(user._id)
        .populate("targetRole")
        .select("-password");

      return res.status(200).json({
        success: true,
        message: "Custom target role saved successfully",
        user: updatedUser
      });
    }

    return res.status(400).json({
      success: false,
      message: "Target role or custom role is required"
    });

  } catch (error) {
    console.error("Update target role error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update target career"
    });
  }
};