import User from "../models/User.js";

import ApiError from "../utils/apiError.js";

import {
  AUTH_COOKIE_NAME,
  verifyToken
} from "../utils/auth.js";

const getTokenFromRequest = (
  req
) => {
  /*
   * Authentication is primarily handled
   * through an HTTP-only cookie.
   *
   * The Authorization header is also supported
   * so the API can later be consumed by mobile
   * applications or other clients.
   */

  if (
    req.cookies &&
    req.cookies[AUTH_COOKIE_NAME]
  ) {
    return req.cookies[
      AUTH_COOKIE_NAME
    ];
  }

  const authorization =
    req.headers.authorization;

  if (
    authorization &&
    authorization.startsWith(
      "Bearer "
    )
  ) {
    return authorization.substring(
      7
    );
  }

  return null;
};

const protect = async (
  req,
  res,
  next
) => {
  try {
    const token =
      getTokenFromRequest(req);

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    let decoded;

    try {
      decoded =
        verifyToken(token);
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired authentication token."
      );
    }

    const user =
      await User.findById(
        decoded.userId
      );

    if (!user) {
      throw new ApiError(
        401,
        "User account no longer exists."
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return next(
      new ApiError(
        401,
        "Authentication required."
      )
    );
  }

  if (
    req.user.role !== "admin"
  ) {
    return next(
      new ApiError(
        403,
        "Administrator access required."
      )
    );
  }

  next();
};

export {
  protect,
  requireAdmin
};