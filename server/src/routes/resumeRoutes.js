import express from "express";

import {
  analyzeResume,
  getLatestResumeAnalysis,
  getResumeAnalysisHistory
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/resumeUpload.js";


const router =
  express.Router();


router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);


router.get(
  "/latest",
  protect,
  getLatestResumeAnalysis
);


router.get(
  "/history",
  protect,
  getResumeAnalysisHistory
);


export default router;