import express from "express";

import {
  getProjects,
  getProjectRecommendations,
  getLatestRecommendations,
  submitProjectForReview,
  getUserSubmissions,
  getSubmissionById
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/recommend", protect, getProjectRecommendations);
router.get("/recommendations", protect, getLatestRecommendations);

router.post("/submit", protect, submitProjectForReview);
router.get("/submissions", protect, getUserSubmissions);
router.get("/submissions/:id", protect, getSubmissionById);

export default router;