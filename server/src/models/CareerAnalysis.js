import mongoose from "mongoose";

const careerAnalysisSchema = new mongoose.Schema(
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

    fileName: {
      type: String,
      default: ""
    },

    githubUsername: {
      type: String,
      default: "",
      trim: true
    },

    githubProfileUrl: {
      type: String,
      default: ""
    },

    githubName: {
      type: String,
      default: ""
    },

    githubAvatarUrl: {
      type: String,
      default: ""
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    githubScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    projectScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    summary: {
      type: String,
      default: ""
    },

    detectedSkills: {
      type: [String],
      default: []
    },

    verifiedSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    skillGaps: {
      type: [String],
      default: []
    },

    resumeStrengths: {
      type: [String],
      default: []
    },

    resumeWeaknesses: {
      type: [String],
      default: []
    },

    githubStrengths: {
      type: [String],
      default: []
    },

    githubWeaknesses: {
      type: [String],
      default: []
    },

    recommendations: {
      type: [String],
      default: []
    },

    projectSuggestions: {
      type: [String],
      default: []
    },

    nextSteps: {
      type: [String],
      default: []
    },

    resumeSuggestions: {
      type: [String],
      default: []
    },

    githubSuggestions: {
      type: [String],
      default: []
    },

    technologies: {
      type: [String],
      default: []
    },

    githubRepositories: {
      type: [
        {
          name: String,
          description: String,
          url: String,
          stars: Number,
          forks: Number,
          language: String,
          topics: [String],
          updatedAt: String
        }
      ],
      default: []
    },

    githubLanguages: {
      type: [
        {
          name: String,
          bytes: Number
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "CareerAnalysis",
  careerAnalysisSchema
);