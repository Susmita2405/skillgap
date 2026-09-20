import Notification from "../models/Notification.js";

export const createNotification =
  async ({
    user,
    title,
    message,
    type = "system",
    link = ""
  }) => {
    return Notification.create({
      user,
      title,
      message,
      type,
      link
    });
  };