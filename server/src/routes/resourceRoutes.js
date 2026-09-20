import express from "express";

import {
  getResources,
  getRecommendedResources
} from "../controllers/resourceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getResources
);

router.get(
  "/recommended",
  protect,
  getRecommendedResources
);

export default router;