import mongoose from "mongoose";

const roadmapItemSchema = new mongoose.Schema(
  {
    weekStart: {
      type: Number,
      required: true,
      min: 1,
      max: 24
    },

    weekEnd: {
      type: Number,
      required: true,
      min: 1,
      max: 24
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000
    },

    topics: {
  type: [String],
  default: []
},

    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      }
    ],

    topics: {
      type: [String],
      default: []
    },

    estimatedHours: {
      type: Number,
      required: true,
      min: 1
    },

    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningResource"
      }
    ],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed"
      ],
      default: "Not Started"
    },

    completed: {
      type: Boolean,
      default: false
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    _id: true
  }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    targetRole: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    generatedAt: {
      type: Date,
      default: Date.now
    },

    totalWeeks: {
      type: Number,
      default: 24,
      min: 1,
      max: 24
    },

    estimatedTotalDuration: {
      type: String,
      default: ""
    },

    alreadyKnownSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    phases: [
      {
        phaseNumber: { type: Number, default: 1 },
        title: { type: String, required: true },
        duration: { type: String, required: true },
        skills: { type: [String], default: [] },
        priority: { type: String, default: "high" },
        why: { type: String, default: "" },
        topics: { type: [String], default: [] },
        estimatedHours: { type: Number, default: 10 }
      }
    ],

    items: {
      type: [roadmapItemSchema],
      default: []
    },

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Roadmap", roadmapSchema);