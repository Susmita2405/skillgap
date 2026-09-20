
import "dotenv/config";

import app from "./app.js";

import {
  connectDatabase,
  disconnectDatabase
} from "./config/db.js";

import {
  env,
  validateEnvironment
} from "./config/env.js";

const startServer = async () => {
  try {
    // --------------------------------------------------
    // Validate Environment
    // --------------------------------------------------

    validateEnvironment();

    // --------------------------------------------------
    // Connect Database
    // --------------------------------------------------

    await connectDatabase();

    // --------------------------------------------------
    // Start HTTP Server
    // --------------------------------------------------

    const server = app.listen(
      env.port,
      () => {
        console.log(
          `Server running on http://localhost:${env.port}`
        );

        console.log(
          `Environment: ${env.nodeEnv}`
        );
      }
    );

    // --------------------------------------------------
    // Graceful Shutdown
    // --------------------------------------------------

    const shutdown = async (signal) => {
      console.log(
        `${signal} received. Shutting down gracefully...`
      );

      server.close(async () => {
        try {
          await disconnectDatabase();

          console.log(
            "Application shutdown complete."
          );

          process.exit(0);
        } catch (error) {
          console.error(
            "Error during shutdown:",
            error
          );

          process.exit(1);
        }
      });
    };

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

// --------------------------------------------------
// Process Error Handling
// --------------------------------------------------

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "Unhandled promise rejection:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught exception:",
      error
    );

    process.exit(1);
  }
);

// --------------------------------------------------
// Start
// --------------------------------------------------

startServer();
