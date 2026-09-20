import mongoose from "mongoose";

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    roleSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },

    skillSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    question: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length >= 2,
        message: "At least two options are required"
      }
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true
    },

    points: {
      type: Number,
      default: 1,
      min: 1
    },

    difficulty: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced"
      ],
      default: "Beginner"
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "AssessmentQuestion",
  assessmentQuestionSchema
);