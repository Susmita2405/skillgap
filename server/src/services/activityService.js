import Activity from "../models/Activity.js";

export const createActivity = async ({
  user,
  type,
  title,
  description = "",
  metadata = {}
}) => {
  try {
    return await Activity.create({
      user,
      type,
      title,
      description,
      metadata
    });
  } catch (error) {
    console.error(
      "Activity creation failed:",
      error.message
    );

    return null;
  }
};