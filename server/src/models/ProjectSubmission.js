import mongoose from "mongoose";

const categoryScoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    feedback: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const projectSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true
    },

    targetRole: {
      type: String,
      default: ""
    },

    githubUrl: {
      type: String,
      required: true,
      trim: true
    },

    submissionNotes: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed", "failed"],
      default: "submitted"
    },

    review: {
      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      summary: {
        type: String,
        default: ""
      },
      categories: [categoryScoreSchema],
      strengths: {
        type: [String],
        default: []
      },
      weaknesses: {
        type: [String],
        default: []
      },
      improvements: {
        type: [String],
        default: []
      },
      industryReadiness: {
        type: String,
        default: "Intermediate"
      },
      analyzedFilesCount: {
        type: Number,
        default: 0
      }
    },

    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("ProjectSubmission", projectSubmissionSchema);
