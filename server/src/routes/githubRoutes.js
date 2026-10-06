import express from "express";

import {
  analyzeGithub,
  getLatestGithubAnalysis,
  getGithubAnalysisHistory
} from "../controllers/githubController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, analyzeGithub);
router.get("/latest", protect, getLatestGithubAnalysis);
router.get("/history", protect, getGithubAnalysisHistory);

export default router;
