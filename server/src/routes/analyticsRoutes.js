import express from "express";


import {
  getCareerAnalytics,
  getAnalyticsChartData
} from "../controllers/analyticsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/career",
  protect,
  getCareerAnalytics
);

router.get(
  "/charts",
  protect,
  getAnalyticsChartData
);

export default router;