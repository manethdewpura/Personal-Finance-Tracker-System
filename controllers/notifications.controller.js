import { logger } from "../utils/winston.utils.js";
import {
  getNotifications,
  updateNotifications,
  deleteNotifications,
} from "../services/notification.service.js";

const getNotificationsController = async (req, res) => {
  logger.info("NotificationController - getNotificationsController");
  try {
    const userId = res.locals.user.id;
    const start = parseInt(req?.query?.start, 10) || 0;
    const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
    const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
    const filter = JSON.parse(req?.query?.filter || "{}");
    const notifications = await getNotifications(userId, start, limit, order, filter);
    logger.info("Fetched all notifications");
    res.json(notifications);
  } catch (error) {
    logger.error("Error fetching notifications");
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationsController = async (req, res) => {
  logger.info("NotificationController - updateNotificationsController");
  try {
    const userId = res.locals.user.id;
    const notification = await updateNotifications(userId, req.params.id, req.body);
    logger.info("Notification updated successfully");
    res.json(notification);
  } catch (error) {
    logger.error("Error updating notification");
    res.status(400).json({ message: error.message });
  }
};

const deleteNotificationsController = async (req, res) => {
  logger.info("NotificationController - deleteNotificationsController");
  try {
    const userId = res.locals.user.id;
    await deleteNotifications(userId, req.params.id);
    logger.info("Notification deleted successfully");
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    logger.error("Error deleting notification");
    res.status(400).json({ message: error.message });
  }
};

export {
  getNotificationsController,
  updateNotificationsController,
  deleteNotificationsController,
};
