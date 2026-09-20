import express from "express";

import {
  createRoadmap,
  getLatestRoadmap,
  getRoadmapByRole,
  updateRoadmapItem
} from "../controllers/roadmapController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  createRoadmap
);

router.get(
  "/latest",
  protect,
  getLatestRoadmap
);

router.get(
  "/role/:targetRole",
  protect,
  getRoadmapByRole
);

router.patch(
  "/:roadmapId/items/:itemId",
  protect,
  updateRoadmapItem
);

export default router;