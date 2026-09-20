import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  updateTargetRole
} from "../controllers/authController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  validateRequired
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRequired([
    "name",
    "email",
    "password"
  ]),
  register
);

router.post(
  "/login",
  validateRequired([
    "email",
    "password"
  ]),
  login
);

router.post(
  "/logout",
  protect,
  logout
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

router.put(
  "/target-role",
  protect,
  updateTargetRole
);

router.put(
  "/target-role",
  protect,
  updateTargetRole
);

router.put(
  "/custom-target-role",
  protect,
  updateTargetRole
);

export default router;