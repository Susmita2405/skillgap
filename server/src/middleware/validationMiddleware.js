export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of fields) {
      const value = req.body[field];

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        fields: missing
      });
    }

    next();
  };
};