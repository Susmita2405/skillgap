import express from "express";

import {
  getRoles,
  getRoleBySlug,
  getSkills,
  getProjects,
  getLearningResources,
  getCareers,
  getCareerById,
  getCareerCategories
} from "../controllers/careerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/roles", getRoles);

router.get("/roles/:slug", getRoleBySlug);

router.get("/skills", getSkills);

router.get("/projects", getProjects);

router.get("/resources", getLearningResources);


router.get("/categories", protect, getCareerCategories);

router.get("/", protect, getCareers);

router.get("/:id", protect, getCareerById);

export default router;