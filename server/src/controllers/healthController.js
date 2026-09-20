import { getHealthStatus } from "../services/healthService.js";

export const healthCheck = (req, res) => {
  const health = getHealthStatus();

  res.status(200).json(health);
};

import {
  successResponse
} from "../utils/apiResponse.js";

const getHealth =
  (req, res) => {
    const health =
      healthService.getHealthStatus();

    const statusCode =
      health.databaseConnected
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