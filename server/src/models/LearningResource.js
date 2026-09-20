import mongoose from "mongoose";

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    skillSlug: {
        type: String,
        required: true
      },

      difficulty: {
        type: String,
        enum: [
          "beginner",
          "intermediate",
          "advanced"
        ],
        default: "beginner"
      },

      estimatedHours: {
        type: Number,
        default: 1
      },

    type: {
      type: String,
      enum: [
        "Course",
        "Documentation",
        "Tutorial",
        "Video",
        "Article",
        "Book"
      ],
      default: "Course"
    },

    provider: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    description: {
        type: String,
        default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "LearningResource",
  learningResourceSchema
);