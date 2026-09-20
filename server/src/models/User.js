import mongoose from "mongoose";

const skillAssessmentSchema =
  new mongoose.Schema(
    {
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true
      },

      level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    {
      _id: false
    }
  );

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
      },

      
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  maxlength: 150
},



      password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
      },

      targetRole: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Role",
  default: null
},

customTargetRole: {
  type: String,
  trim: true,
  maxlength: 80,
  default: ""
},

      role: {
        type: String,
        enum: [
          "student",
          "admin"
        ],
        default: "student",
        index: true
      },

      education: {
        type: String,
        enum: [
          "High School",
          "Diploma",
          "Undergraduate",
          "Postgraduate",
          "Other"
        ],
        default: null
      },

      experienceLevel: {
        type: String,
        enum: [
          "Beginner",
          "Intermediate",
          "Advanced"
        ],
        default: "Beginner"
      },

      targetRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: null
      },

      skillAssessments: {
        type: [skillAssessmentSchema],
        default: []
      },

      careerReadinessScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },

      bio: {
      type: String,
      default: ""
      },

      currentSkills: [
      {
      type: String
      }
      ],

      onboardingCompleted: {
        type: Boolean,
        default: false
      },

      preferences: {
        theme: {
          type: String,
          enum: [
            "light",
            "dark",
            "system"
          ],
          default: "system"
        },

        weeklyLearningGoal: {
          type: Number,
          default: 8,
          min: 0,
          max: 168
        }
      },

      lastLoginAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );


const User =
  mongoose.model(
    "User",
    userSchema
  );

export default User;