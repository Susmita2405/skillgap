import express from "express";

import {
  analyzeCareerProfile,
  getLatestCareerAnalysis,
  getCareerAnalysisHistory
} from "../controllers/careerAnalysisController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/resumeUpload.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeCareerProfile
);

router.get(
  "/latest",
  protect,
  getLatestCareerAnalysis
);

router.get(
  "/history",
  protect,
  getCareerAnalysisHistory
);

export default router;