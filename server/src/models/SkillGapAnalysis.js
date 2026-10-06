import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    mySkills: {
      type: Boolean,
      default: false,
    },

    resume: {
      type: Boolean,
      default: false,
    },

    github: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const skillResultSchema = new mongoose.Schema(
  {
    skillSlug: {
      type: String,
      required: true,
      trim: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true,
    },

    required: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: Number,
      default: 2,
    },

    studentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Strong", "Moderate", "Missing"],
      default: "Missing",
    },

    gap: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    evidence: {
      type: evidenceSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  }
);

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    targetRoleName: {
      type: String,
      default: "",
      trim: true,
    },

    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    strongSkills: {
      type: [String],
      default: [],
    },

    moderateSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    skillCounts: {
      strong: {
        type: Number,
        default: 0,
      },

      moderate: {
        type: Number,
        default: 0,
      },

      missing: {
        type: Number,
        default: 0,
      },
    },

    skills: {
      type: [skillResultSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One current Skill Gap analysis
 * per user + target role.
 */
skillGapAnalysisSchema.index(
  {
    user: 1,
    targetRole: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "SkillGapAnalysis",
  skillGapAnalysisSchema
);