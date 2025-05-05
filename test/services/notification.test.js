import { jest } from '@jest/globals';
import { sendNotification, getNotifications, updateNotifications, deleteNotifications } from '../../services/notification.service.js';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Notification Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockTransaction = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Transaction',
  };

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      const user = new User({ _id: mockUserId, notifications: [] });
      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      await sendNotification(mockUserId, mockTransaction);
      expect(user.notifications).toHaveLength(1);
      expect(user.notifications[0].description).toBe(`New recurring transaction created: ${mockTransaction.description}`);
    });

    it('should return null if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      const result = await sendNotification(mockUserId, mockTransaction);
      expect(result).toBeNull();
    });
  });

  describe('getNotifications', () => {
    it('should get all notifications for a user', async () => {
      const user = new User({ _id: mockUserId, notifications: [{ description: 'Test Notification' }] });
      User.findById = jest.fn().mockResolvedValue(user);

      const notifications = await getNotifications(mockUserId, 0, 10, -1, {});
      expect(notifications).toHaveLength(1);
      expect(notifications[0].description).toBe('Test Notification');
    });

    it('should return empty array if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      const notifications = await getNotifications(mockUserId, 0, 10, -1, {});
      expect(notifications).toEqual([]);
    });
  });

  describe('updateNotifications', () => {
    it('should update an existing notification', async () => {
      const user = new User({ _id: mockUserId, notifications: [{ _id: new mongoose.Types.ObjectId(), description: 'Old Notification' }] });
      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      const notificationId = user.notifications[0]._id;
      const updatedData = { description: 'Updated Notification' };
      const updatedNotification = await updateNotifications(mockUserId, notificationId, updatedData);
      expect(updatedNotification.description).toBe('Updated Notification');
    });

    it('should return null if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      const result = await updateNotifications(mockUserId, new mongoose.Types.ObjectId(), {});
      expect(result).toBeNull();
    });

    it('should return null if notification not found', async () => {
      const user = new User({ _id: mockUserId, notifications: [] });
      User.findById = jest.fn().mockResolvedValue(user);
      const result = await updateNotifications(mockUserId, new mongoose.Types.ObjectId(), {});
      expect(result).toBeNull();
    });
  });

  describe('deleteNotifications', () => {
    it('should delete an existing notification', async () => {
      const notificationId = new mongoose.Types.ObjectId();
      const user = new User({ _id: mockUserId, notifications: [{ _id: notificationId, description: 'Test Notification' }] });
      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      const deletedNotification = await deleteNotifications(mockUserId, notificationId);
      expect(deletedNotification._id).toEqual(notificationId);
      expect(user.notifications).toHaveLength(0);
    });

    it('should return null if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      const result = await deleteNotifications(mockUserId, new mongoose.Types.ObjectId());
      expect(result).toBeNull();
    });

    it('should return null if notification not found', async () => {
      const user = new User({ _id: mockUserId, notifications: [] });
      User.findById = jest.fn().mockResolvedValue(user);
      const result = await deleteNotifications(mockUserId, new mongoose.Types.ObjectId());
      expect(result).toBeNull();
    });
  });
});
