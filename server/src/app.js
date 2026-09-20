
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import skillGapRoutes from "./routes/skillGapRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import roleComparisonRoutes from "./routes/roleComparisonRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminContentRoutes from "./routes/adminContentRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";



import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

import {
  generalLimiter
} from "./middleware/rateLimitMiddleware.js";

const app = express();

app.disable("x-powered-by");

// --------------------------------------------------
// SECURITY
// --------------------------------------------------

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true
  })
);

// --------------------------------------------------
// BODY PARSING
// --------------------------------------------------

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

app.use(cookieParser());

// --------------------------------------------------
// SANITIZATION
// --------------------------------------------------

//app.use(mongoSanitize());

// --------------------------------------------------
// RATE LIMITING
// --------------------------------------------------

app.use(
  "/api",
  generalLimiter
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later."
  }
});

app.use(
  "/api/auth",
  authLimiter
);

// --------------------------------------------------
// ROOT
// --------------------------------------------------

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Student Skill-Gap & Career Planner API",
      version: "1.0.0"
    });
  }
);

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use(
  "/api/health",
  healthRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/onboarding",
  onboardingRoutes
);

app.use(
  "/api/career",
  careerRoutes
);

app.use(
  "/api/careers",
  careerRoutes
);

app.use(
  "/api/assessment",
  assessmentRoutes
);

app.use(
  "/api/skill-gap",
  skillGapRoutes
);

app.use(
  "/api/roadmap",
  roadmapRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/activities",
  activityRoutes
);

app.use(
  "/api/favorites",
  favoriteRoutes
);

app.use(
  "/api/resources",
  resourceRoutes
);

app.use(
  "/api/role-comparison",
  roleComparisonRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin/content",
  adminContentRoutes
);

// --------------------------------------------------
// 404 HANDLER
// --------------------------------------------------

app.use(notFound);
app.use("/api/skills", skillRoutes);

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// EXPORT
// --------------------------------------------------

export default app;

