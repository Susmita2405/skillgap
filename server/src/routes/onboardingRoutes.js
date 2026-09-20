import express from "express";

import {
  getOnboardingData,
  getOnboardingStatus,
  completeOnboarding
} from "../controllers/onboardingController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  validateRequired
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get(
  "/data",
  protect,
  getOnboardingData
);

router.get(
  "/status",
  protect,
  getOnboardingStatus
);

router.post(
  "/complete",
  protect,
  validateRequired([
    "name",
    "targetRole"
  ]),
  completeOnboarding
);

export default router;