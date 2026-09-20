import mongoose from "mongoose";

const skillAnalysisSchema = new mongoose.Schema(
  {
    skillSlug: {
      type: String,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    priority: {
      type: Number,
      default: 2
    },

    studentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: [
        "Strong",
        "Moderate",
        "Weak",
        "Missing"
      ],
      required: true
    },

    gap: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    _id: false
  }
);

const skillGapAnalysisSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      targetRole: {
        type: String,
        required: true
      },

      readinessScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },

      strongSkills: {
        type: [String],
        default: []
      },

      moderateSkills: {
        type: [String],
        default: []
      },

      weakSkills: {
        type: [String],
        default: []
      },

      missingSkills: {
        type: [String],
        default: []
      },

      skills: {
        type: [skillAnalysisSchema],
        default: []
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "SkillGapAnalysis",
  skillGapAnalysisSchema
);