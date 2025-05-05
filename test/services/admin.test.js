import { jest } from '@jest/globals';
import adminService from '../../services/admin.service.js';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Admin Service Tests', () => {
  const mockUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    userRole: 'user'
  };

  describe('getAllUsers', () => {
    beforeEach(async () => {
      await User.create(mockUserData);
      await User.create({ 
        ...mockUserData, 
        username: 'testuser2',
        email: 'test2@example.com' 
      });
    });

    it('should get all users', async () => {
      const users = await adminService.getAllUsers();
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty('email');
    });
  });

  describe('updateUserRole', () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create(mockUserData);
      userId = user._id;
    });

    it('should update user role', async () => {
      const updatedData = { userRole: 'admin' };  // Changed from role to userRole
      const updated = await adminService.updateUserRole(userId, updatedData);
      expect(updated.userRole).toBe('admin');  // Changed from role to userRole
    });

    it('should throw error for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(adminService.updateUserRole(fakeId, { userRole: 'admin' }))  // Changed from role to userRole
        .rejects
        .toThrow();
    });
  });

  describe('deleteUser', () => {
    let userId;

    beforeEach(async () => {
      const user = await User.create(mockUserData);
      userId = user._id;
    });

    it('should delete an existing user', async () => {
      const result = await adminService.deleteUser(userId);
      expect(result).toBe(true);
      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(adminService.deleteUser(fakeId))
        .rejects
        .toThrow();
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });
});
