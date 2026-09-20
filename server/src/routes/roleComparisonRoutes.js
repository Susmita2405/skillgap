import express from "express";
import { compareRoles } from "../controllers/roleComparisonController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, compareRoles);

export default router;