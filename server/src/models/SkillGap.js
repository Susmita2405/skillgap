import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema(
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

    strongSkills: {
      type: [String],
      default: []
    },

    moderateSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("SkillGap", skillGapSchema);