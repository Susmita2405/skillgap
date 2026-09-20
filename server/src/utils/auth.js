import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const AUTH_COOKIE_NAME = "scp_token";

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId
    },
    env.jwtSecret,
    {
      expiresIn: "7d"
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    env.jwtSecret
  );
};

const setAuthCookie = (
  res,
  token
) => {
  const isProduction =
    env.nodeEnv === "production";

  res.cookie(
    AUTH_COOKIE_NAME,
    token,
    {
      httpOnly: true,

      secure: isProduction,

      sameSite:
        isProduction
          ? "none"
          : "lax",

      maxAge:
        7 * 24 * 60 * 60 * 1000,

      path: "/"
    }
  );
};

const clearAuthCookie = (
  res
) => {
  const isProduction =
    env.nodeEnv === "production";

  res.clearCookie(
    AUTH_COOKIE_NAME,
    {
      httpOnly: true,

      secure: isProduction,

      sameSite:
        isProduction
          ? "none"
          : "lax",

      path: "/"
    }
  );
};

export {
  AUTH_COOKIE_NAME,
  generateToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie
};