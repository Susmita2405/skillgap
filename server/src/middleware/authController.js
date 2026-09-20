import bcrypt from "bcryptjs";

import User from "../models/User.js";

import ApiError from "../utils/apiError.js";

import {
  successResponse
} from "../utils/apiResponse.js";

import {
  generateToken,
  setAuthCookie,
  clearAuthCookie
} from "../utils/auth.js";

const normalizeEmail = (
  email
) => {
  return email
    .trim()
    .toLowerCase();
};

const sanitizeUser = (
  user
) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    education:
      user.education,
    experienceLevel:
      user.experienceLevel,
    targetRole:
      user.targetRole,
    skillAssessments:
      user.skillAssessments,
    careerReadinessScore:
      user.careerReadinessScore,
    onboardingCompleted:
      user.onboardingCompleted,
    preferences:
      user.preferences,
    lastLoginAt:
      user.lastLoginAt,
    createdAt:
      user.createdAt,
    updatedAt:
      user.updatedAt
  };
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

const register = async (
  req,
  res
) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    throw new ApiError(
      400,
      "Name is required."
    );
  }

  if (
    typeof email !== "string" ||
    !email.trim()
  ) {
    throw new ApiError(
      400,
      "Email is required."
    );
  }

  if (
    typeof password !== "string"
  ) {
    throw new ApiError(
      400,
      "Password is required."
    );
  }

  const normalizedEmail =
    normalizeEmail(email);

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailRegex.test(
      normalizedEmail
    )
  ) {
    throw new ApiError(
      400,
      "Please provide a valid email address."
    );
  }

  if (
    password.length < 8
  ) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters."
    );
  }

  if (
    password.length > 128
  ) {
    throw new ApiError(
      400,
      "Password must not exceed 128 characters."
    );
  }

  const existingUser =
    await User.findOne({
      email: normalizedEmail
    });

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists."
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      12
    );

  const user =
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

  const token =
    generateToken(
      user._id.toString()
    );

  setAuthCookie(
    res,
    token
  );

  return successResponse(
    res,
    {
      statusCode: 201,
      message:
        "Account created successfully.",
      data: {
        user:
          sanitizeUser(user)
      }
    }
  );
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

const login = async (
  req,
  res
) => {
  const {
    email,
    password
  } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim()
  ) {
    throw new ApiError(
      400,
      "Email is required."
    );
  }

  if (
    typeof password !== "string" ||
    !password
  ) {
    throw new ApiError(
      400,
      "Password is required."
    );
  }

  const normalizedEmail =
    normalizeEmail(email);

  const user =
    await User.findOne({
      email: normalizedEmail
    }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  user.lastLoginAt =
    new Date();

  await user.save();

  const token =
    generateToken(
      user._id.toString()
    );

  setAuthCookie(
    res,
    token
  );

  return successResponse(
    res,
    {
      message:
        "Login successful.",
      data: {
        user:
          sanitizeUser(user)
      }
    }
  );
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

const logout = async (
  req,
  res
) => {
  clearAuthCookie(
    res
  );

  return successResponse(
    res,
    {
      message:
        "Logged out successfully."
    }
  );
};

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

const getCurrentUser =
  async (
    req,
    res
  ) => {
    return successResponse(
      res,
      {
        message:
          "Current user retrieved.",
        data: {
          user:
            sanitizeUser(
              req.user
            )
        }
      }
    );
  };

export {
  register,
  login,
  logout,
  getCurrentUser
};