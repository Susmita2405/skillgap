import express from "express";

import {
  getProjects,
  getProjectRecommendations,
  getLatestRecommendations
} from "../controllers/projectController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getProjects
);

router.post(
  "/recommend",
  protect,
  getProjectRecommendations
);

router.get(
  "/recommendations",
  protect,
  getLatestRecommendations
);

export default router;