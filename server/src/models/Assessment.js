import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    skillSlug: {
      type: String,
      required: true,
      trim: true
    },

    questionId: {
      type: String,
      required: true,
      trim: true
    },

    answer: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const skillResultSchema = new mongoose.Schema(
  {
    skillSlug: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced"
      ],
      required: true
    },

    correctAnswers: {
      type: Number,
      default: 0
    },

    totalQuestions: {
      type: Number,
      default: 0
    }
  },
  {
    _id: false
  }
);

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    targetRole: {
      type: String,
      required: true,
      trim: true
    },

    skills: {
      type: [String],
      default: []
    },

    answers: {
      type: [answerSchema],
      default: []
    },

    results: {
      type: [skillResultSchema],
      default: []
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Assessment",
  assessmentSchema
);