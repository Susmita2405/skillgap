import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    // =========================
    // USER / FILE INFORMATION
    // =========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    fileName: {
      type: String,
      required: true,
      trim: true
    },

    fileSize: {
      type: Number,
      default: 0
    },

    targetRole: {
      type: String,
      default: "",
      trim: true
    },

    extractedText: {
      type: String,
      required: true
    },

    // =========================
    // SCORES
    // =========================

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

    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // =========================
    // GENERAL ANALYSIS
    // =========================

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

    resumeStrengths: {
      type: [String],
      default: []
    },

    resumeWeaknesses: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    strengths: {
      type: [String],
      default: []
    },

    weaknesses: {
      type: [String],
      default: []
    },

    formattingIssues: {
      type: [String],
      default: []
    },

    suggestions: {
      type: [String],
      default: []
    },

    keywords: {
      type: [String],
      default: []
    },

    // =========================
    // EXPERIENCE
    // =========================

    experience: {
      type: [
        {
          jobTitle: {
            type: String,
            default: ""
          },

          company: {
            type: String,
            default: ""
          },

          duration: {
            type: String,
            default: ""
          },

          location: {
            type: String,
            default: ""
          },

          description: {
            type: String,
            default: ""
          },

          achievements: {
            type: [String],
            default: []
          }
        }
      ],
      default: []
    },

    // =========================
    // EDUCATION
    // =========================

    education: {
      type: [
        {
          degree: {
            type: String,
            default: ""
          },

          institution: {
            type: String,
            default: ""
          },

          year: {
            type: String,
            default: ""
          },

          location: {
            type: String,
            default: ""
          },

          details: {
            type: String,
            default: ""
          },

          grade: {
            type: String,
            default: ""
          }
        }
      ],
      default: []
    },

    // =========================
    // PROJECTS
    // =========================

    projects: {
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

          technologies: {
            type: [String],
            default: []
          },

          role: {
            type: String,
            default: ""
          },

          link: {
            type: String,
            default: ""
          }
        }
      ],
      default: []
    },

    // =========================
    // CERTIFICATIONS
    // =========================

    certifications: {
      type: [
        {
          name: {
            type: String,
            default: ""
          },

          issuer: {
            type: String,
            default: ""
          },

          year: {
            type: String,
            default: ""
          },

          link: {
            type: String,
            default: ""
          }
        }
      ],
      default: []
    },

    // =========================
    // ACHIEVEMENTS
    // =========================

    achievements: {
      type: [String],
      default: []
    },

    // =========================
    // LANGUAGES
    // =========================

    languages: {
      type: [String],
      default: []
    },

    // =========================
    // LINKS
    // =========================

    links: {
      type: [
        {
          type: {
            type: String,
            default: ""
          },

          url: {
            type: String,
            default: ""
          }
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
  "ResumeAnalysis",
  resumeAnalysisSchema
);