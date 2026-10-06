import mongoose from "mongoose";
import { getHealthStatus } from "../services/healthService.js";

export const healthCheck = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const health = {
    ...getHealthStatus(),
    databaseConnected: isDbConnected
  };

  res.status(isDbConnected ? 200 : 503).json(health);
};

import {
  successResponse
} from "../utils/apiResponse.js";

const getHealth =
  (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const health = {
      ...getHealthStatus(),
      databaseConnected: isDbConnected
    };

    const statusCode =
      isDbConnected
        ? 200
        : 503;

    return successResponse(
      res,
      {
        statusCode,
        message:
          health.databaseConnected
            ? "API is healthy."
            : "API is running but database is unavailable.",
        data: health
      }
    );
  };

export {
  getHealth
};