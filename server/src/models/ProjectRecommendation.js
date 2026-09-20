import mongoose from "mongoose";

const recommendedProjectSchema =
  new mongoose.Schema(
    {
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
      },

      matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },

      matchedSkills: {
        type: [String],
        default: []
      },

      skillsToLearn: {
        type: [String],
        default: []
      }
    },
    {
      _id: false
    }
  );

const projectRecommendationSchema =
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

      recommendations: {
        type: [
          recommendedProjectSchema
        ],
        default: []
      }
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "ProjectRecommendation",
  projectRecommendationSchema
);