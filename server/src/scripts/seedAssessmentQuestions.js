import "dotenv/config";
import mongoose from "mongoose";

import AssessmentQuestion from "../models/AssessmentQuestion.js";
import assessmentQuestions from "../data/assessmentQuestions.js";

const seed = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    await AssessmentQuestion.deleteMany({});

    await AssessmentQuestion.insertMany(
      assessmentQuestions
    );

    console.log(
      `${assessmentQuestions.length} assessment questions inserted`
    );

    await mongoose.disconnect();

    console.log("Seed complete");

  } catch (error) {

    console.error(
      "Assessment seed error:",
      error
    );

    process.exit(1);
  }
};

seed();
