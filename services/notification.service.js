import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import User from "../models/user.model.js";

const sendNotification = async (userId, transaction) => {
  logger.info("NotificationService - sendNotification");
  
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    logger.error("Error finding user");
    throw ThrowError(error);
  }

  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    return null;
  }

  try {
    user.notifications.push({
      description: `New recurring transaction created: ${transaction.description}`,
      transaction: transaction._id,
    });
    await user.save();
    logger.info("Notification sent successfully");
  } catch (error) {
    logger.error("Error sending notification");
    throw ThrowError(error);
  }
};

const getNotifications = async (userId, start, limit, order, filter) => {
  logger.info("NotificationService - getNotifications");

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.error(`User with ID ${userId} not found`);
      return [];
    }

    const notifications = await User.populate(user, {
      path: "notifications",
      match: filter,
      options: {
        sort: { createdAt: order },
        skip: start,
        limit: limit,
      },
    });

    return notifications.notifications;
  } catch (error) {
    logger.error("Error fetching notifications");
    throw ThrowError(error);
  }
};

const updateNotifications = async (userId, id, data) => {
  logger.info(`NotificationService - updateNotifications`);
  
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    logger.error("Error finding user");
    throw ThrowError(error);
  }

  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    return null;
  }

  const notification = user.notifications.id(id);
  if (!notification) {
    logger.error(`Notification with ID ${id} not found`);
    return null;
  }

  try {
    Object.assign(notification, data);
    await user.save();
    logger.info(`Updating notification with ID: ${id}`);
    return notification;
  } catch (error) {
    logger.error(`Error updating notification`);
    throw ThrowError(error);
  }
};

const deleteNotifications = async (userId, id) => {
  logger.info("NotificationService - deleteNotifications");
  
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    logger.error("Error finding user");
    throw ThrowError(error);
  }

  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    return null;
  }

  const notification = user.notifications.id(id);
  if (!notification) {
    logger.error(`Notification with ID ${id} not found`);
    return null;
  }

  try {
    user.notifications.pull(id);
    await user.save();
    logger.info(`Deleting notification with ID: ${id}`);
    return notification;
  } catch (error) {
    logger.error(`Error deleting notification`);
    throw ThrowError(error);
  }
};

export {
  sendNotification,
  getNotifications,
  updateNotifications,
  deleteNotifications,
};
