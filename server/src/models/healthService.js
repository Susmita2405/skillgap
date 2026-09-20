import mongoose from "mongoose";

const getHealthStatus =
  () => {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    const databaseState =
      mongoose.connection.readyState;

    return {
      application: "healthy",

      database:
        states[databaseState] ||
        "unknown",

      databaseConnected:
        databaseState === 1,

      uptime:
        Math.round(
          process.uptime()
        ),

      timestamp:
        new Date().toISOString()
    };
  };

export default {
  getHealthStatus
};