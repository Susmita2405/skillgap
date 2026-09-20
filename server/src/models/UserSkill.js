import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    source: {
      type: String,
      enum: ["user", "ai"],
      default: "user"
    },

    proficiency: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    }
  },
  {
    timestamps: true
  }
);

userSkillSchema.index(
  { user: 1, normalizedName: 1 },
  { unique: true }
);

export default mongoose.model("UserSkill", userSkillSchema);