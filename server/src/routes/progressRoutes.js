import express from "express";

import {
  getProgress,
  updateSkillProgress,
  updateProjectProgress,
  updateRoadmapProgress
} from "../controllers/progressController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getProgress
);

router.patch(
  "/skills/:skillSlug",
  protect,
  updateSkillProgress
);

router.patch(
  "/projects/:projectId",
  protect,
  updateProjectProgress
);

router.patch(
  "/roadmap",
  protect,
  updateRoadmapProgress
);

export default router;