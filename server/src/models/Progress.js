import mongoose from "mongoose";

const weeklyProgressSchema =
  new mongoose.Schema(
    {
      week: {
        type: Number,
        required: true,
        min: 1,
        max: 24
      },

      hoursLogged: {
        type: Number,
        default: 0,
        min: 0,
        max: 168
      },

      goalHours: {
        type: Number,
        default: 8,
        min: 0,
        max: 168
      },

      completedItems: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    {
      _id: false
    }
  );

const completedProjectSchema =
  new mongoose.Schema(
    {
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
      },

      completedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      _id: false
    }
  );

const progressSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
      },

      roadmapPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },

      totalLearningHours: {
        type: Number,
        default: 0,
        min: 0
      },

      weeklyProgress: {
        type: [weeklyProgressSchema],
        default: []
      },

      completedProjects: {
        type: [completedProjectSchema],
        default: []
      },

      lastActivityAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

const Progress =
  mongoose.model(
    "Progress",
    progressSchema
  );

export default Progress;



// new 

// import mongoose from "mongoose";

// const skillProgressSchema =
//   new mongoose.Schema(
//     {
//       skillSlug: {
//         type: String,
//         required: true
//       },

//       progress: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100
//       }
//     },
//     {
//       _id: false
//     }
//   );

// const projectProgressSchema =
//   new mongoose.Schema(
//     {
//       project: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Project",
//         required: true
//       },

//       progress: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100
//       },

//       status: {
//         type: String,
//         enum: [
//           "Not Started",
//           "In Progress",
//           "Completed"
//         ],
//         default: "Not Started"
//       }
//     },
//     {
//       _id: false
//     }
//   );

// const progressSchema =
//   new mongoose.Schema(
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         unique: true
//       },

//       skills: {
//         type: [skillProgressSchema],
//         default: []
//       },

//       projects: {
//         type: [projectProgressSchema],
//         default: []
//       },

//       roadmapProgress: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100
//       },

//       overallProgress: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 100
//       }
//     },
//     {
//       timestamps: true
//     }
//   );

// export default mongoose.model(
//   "Progress",
//   progressSchema
// );