import mongoose from "mongoose";

const roleSkillSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true
    },

    importance: {
      type: String,
      enum: ["required", "important", "optional"],
      default: "important"
    },

    priority: {
      type: Number,
      default: 2,
      min: 1,
      max: 5
    }
  },
  {
    _id: false
  }
);

const roleSchema = new mongoose.Schema(
  {
    name: {
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

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: String,
      default: "Entry Level"
    },

    averagePreparationMonths: {
      type: Number,
      default: 6,
      min: 1
    },

    skills: {
      type: [roleSkillSchema],
      default: []
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

export default mongoose.model("Role", roleSchema);