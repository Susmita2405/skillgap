import express from "express";

import {
  generateSkillGapAnalysis,
  getLatestSkillGap,
  getMySkillGapHistory
} from "../controllers/skillGapController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  getSkillGapAnalysis
} from "../controllers/skillGapController.js";


const router = express.Router();

router.post(
  "/analyze",
  protect,
  generateSkillGapAnalysis
);

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

router.get(
  "/analyze",
  protect,
  getSkillGapAnalysis
);

router.get(
  "/history",
  protect,
  getMySkillGapHistory
);

export default router;