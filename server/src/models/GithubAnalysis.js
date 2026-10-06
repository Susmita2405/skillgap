import mongoose from "mongoose";

const githubAnalysisSchema = new mongoose.Schema(
  {
    // ============================================
    // USER
    // ============================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // ============================================
    // GITHUB PROFILE
    // ============================================

    githubUsername: {
      type: String,
      default: "",
      trim: true
    },

    profileUrl: {
      type: String,
      default: ""
    },

    avatarUrl: {
      type: String,
      default: ""
    },

    name: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    publicRepositories: {
      type: Number,
      default: 0
    },

    followers: {
      type: Number,
      default: 0
    },

    following: {
      type: Number,
      default: 0
    },

    // ============================================
    // GITHUB REPOSITORIES
    // ============================================

    repositories: {
      type: [
        {
          name: {
            type: String,
            default: ""
          },

          description: {
            type: String,
            default: ""
          },

          url: {
            type: String,
            default: ""
          },

          stars: {
            type: Number,
            default: 0
          },

          forks: {
            type: Number,
            default: 0
          },

          language: {
            type: String,
            default: ""
          },

          topics: {
            type: [String],
            default: []
          },

          updatedAt: {
            type: String,
            default: ""
          }
        }
      ],
      default: []
    },

    // ============================================
    // GITHUB LANGUAGES
    // ============================================

    languages: {
      type: [
        {
          name: {
            type: String,
            default: ""
          },

          bytes: {
            type: Number,
            default: 0
          }
        }
      ],
      default: []
    },

    // ============================================
    // RECENT ACTIVITY
    // ============================================

    recentActivity: {
      type: [String],
      default: []
    },

    // ============================================
    // AI ANALYSIS
    // ============================================

    verifiedSkills: {
      type: [String],
      default: []
    },

    detectedSkills: {
      type: [String],
      default: []
    },

    skills: {
      type: [String],
      default: []
    },

    technologies: {
      type: [String],
      default: []
    },

    techStack: {
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

    suggestions: {
      type: [String],
      default: []
    },

    summary: {
      type: String,
      default: ""
    },

    score: {
      type: Number,
      default: 0
    },

    githubScore: {
      type: Number,
      default: 0
    },

    // ============================================
    // KEEP ANY OTHER AI OUTPUT
    // ============================================

    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.model(
  "GithubAnalysis",
  githubAnalysisSchema
);