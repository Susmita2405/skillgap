const requiredEnvironmentVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY"
];

const validateEnvironment = () => {
  const missingVariables =
    requiredEnvironmentVariables.filter(
      (variable) => !process.env[variable]
    );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters long."
    );
  }
};

const env = {
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  clientUrl:
    process.env.CLIENT_URL ||
    "http://localhost:5173",

  nodeEnv:
    process.env.NODE_ENV ||
    "development"
};

export {
  env,
  validateEnvironment
};