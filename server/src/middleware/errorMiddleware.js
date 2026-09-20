export const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(
    `[ERROR] ${req.method} ${req.originalUrl}`,
    error
  );

  let statusCode =
    error.statusCode || 500;

  let message =
    error.message ||
    "Internal server error";

  if (
    error.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      error.errors
    )
      .map(
        (item) => item.message
      )
      .join(", ");
  }

  if (
    error.name ===
    "CastError"
  ) {
    statusCode = 400;
    message = "Invalid ID";
  }

  if (
    error.code === 11000
  ) {
    statusCode = 409;
    message =
      "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,

    ...(process.env.NODE_ENV ===
      "development" && {
      stack: error.stack
    })
  });
};