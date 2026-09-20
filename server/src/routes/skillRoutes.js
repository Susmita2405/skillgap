import express from "express";

import {
  getMySkills,
  addSkill,
  addMultipleSkills,
  deleteSkill
} from "../controllers/skillController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, getMySkills);

router.post("/", protect, addSkill);

router.post("/bulk", protect, addMultipleSkills);

router.delete("/:id", protect, deleteSkill);

export default router;