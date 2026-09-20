import mongoose from "mongoose";

import { env } from "./env.js";

const connectDatabase = async () => {
  try {
    mongoose.set(
      "strictQuery",
      true
    );

    const connection =
      await mongoose.connect(
        env.mongoUri,
        {
          serverSelectionTimeoutMS: 10000
        }
      );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

const disconnectDatabase =
  async () => {
    try {
      await mongoose.disconnect();

      console.log(
        "MongoDB connection closed."
      );
    } catch (error) {
      console.error(
        "Error closing MongoDB connection:",
        error.message
      );
    }
  };

export {
  connectDatabase,
  disconnectDatabase
};