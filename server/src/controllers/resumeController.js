import { PDFParse } from "pdf-parse";

import ResumeAnalysis from "../models/ResumeAnalysis.js";

import {
  analyzeResumeWithGemini
} from "../services/resumeAnalysisService.js";

import {
  recalculateAndSaveSkillGap
} from "../services/skillGapService.js";


export const analyzeResume = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume."
      });
    }

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes are supported."
      });
    }

    const targetRole =
      String(
        req.body.targetRole || ""
      ).trim();

const parser = new PDFParse({
  data: req.file.buffer,
});

const pdfData = await parser.getText();

await parser.destroy();

const extractedText = String(pdfData.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF."
      });
    }

    if (extractedText.length < 100) {
      return res.status(400).json({
        success: false,
        message:
          "The resume contains too little readable text to analyze."
      });
    }

    const analysis =
      await analyzeResumeWithGemini({
        resumeText: extractedText,
        targetRole
      });

    const savedAnalysis =
      await ResumeAnalysis.create({
        user: req.user._id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        targetRole,
        extractedText,
        ...analysis
      });

    console.log(
      "Resume analysis saved successfully:",
      savedAnalysis._id
    );

    // Automatically recalculate skill gap with existing My Skills + NEW Resume Analysis
    const updatedSkillGap = await recalculateAndSaveSkillGap(
      req.user._id,
      targetRole
    );

    return res.status(201).json({
      success: true,
      message:
        "Resume analyzed successfully.",
      data: savedAnalysis,
      skillGap: updatedSkillGap
    });

  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    next(error);
  }
};


export const getLatestResumeAnalysis =
  async (req, res, next) => {
    try {
      const analysis =
        await ResumeAnalysis.findOne({
          user: req.user._id
        })
          .sort({
            createdAt: -1
          })
          .lean();

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "No resume analysis found."
        });
      }

      return res.status(200).json({
        success: true,
        data: analysis
      });

    } catch (error) {
      next(error);
    }
  };


export const getResumeAnalysisHistory =
  async (req, res, next) => {
    try {
      const analyses =
        await ResumeAnalysis.find({
          user: req.user._id
        })
          .select(
            "-extractedText"
          )
          .sort({
            createdAt: -1
          })
          .lean();

      return res.status(200).json({
        success: true,
        data: analyses
      });

    } catch (error) {
      next(error);
    }
  };