import express from "express";

import {
  generateSkillGapAnalysis,
  getLatestSkillGap,
  getSkillGapAnalysis,
  getMySkillGapHistory
} from "../controllers/skillGapController.js";

import {
  protect
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| GENERATE / REFRESH
|--------------------------------------------------------------------------
*/

router.post(
  "/analyze",
  protect,
  generateSkillGapAnalysis
);


/*
|--------------------------------------------------------------------------
| LATEST
|--------------------------------------------------------------------------
*/

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);


/*
|--------------------------------------------------------------------------
| ANALYZE SPECIFIC ROLE
|--------------------------------------------------------------------------
*/

router.get(
  "/analyze",
  protect,
  getSkillGapAnalysis
);


/*
|--------------------------------------------------------------------------
| HISTORY
|--------------------------------------------------------------------------
*/

router.get(
  "/history",
  protect,
  getMySkillGapHistory
);


export default router;