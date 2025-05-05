import { jest } from '@jest/globals';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../../services/goals.service.js';
import Goal from '../../models/goals.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Goal Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockGoalData = {
    name: 'Test Goal',
    amount: 1000,
    description: 'Test Description',
    monthlyContribution: 100
  };

  describe('createGoal', () => {
    it('should create a new goal', async () => {
      const goal = await createGoal(mockUserId, mockGoalData);
      expect(goal.user).toEqual(mockUserId);
      expect(goal.name).toBe(mockGoalData.name);
      expect(goal.amount).toBe(mockGoalData.amount);
    });
  });

  describe('getGoals', () => {
    beforeEach(async () => {
      await Goal.create({ ...mockGoalData, user: mockUserId });
      await Goal.create({ ...mockGoalData, name: 'Second Goal', user: mockUserId });
    });

    it('should get all goals for a user', async () => {
      const goals = await getGoals(mockUserId, 0, 10, { createdAt: -1 }, {});
      expect(goals).toHaveLength(2);
      expect(goals[0].user).toEqual(mockUserId);
    });
  });

  describe('updateGoal', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({ ...mockGoalData, user: mockUserId });
      goalId = goal._id;
    });

    it('should update an existing goal', async () => {
      const updatedData = { name: 'Updated Goal' };
      const updated = await updateGoal(mockUserId, goalId, updatedData);
      expect(updated.name).toBe('Updated Goal');
    });

    it('should throw error for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(updateGoal(mockUserId, fakeId, {}))
        .rejects
        .toThrow('Goal not found or user not authorized');
    });
  });

  describe('deleteGoal', () => {
    let goalId;

    beforeEach(async () => {
      const goal = await Goal.create({ ...mockGoalData, user: mockUserId });
      goalId = goal._id;
    });

    it('should delete an existing goal', async () => {
      const result = await deleteGoal(mockUserId, goalId);
      expect(result).toBe(true);
      const goal = await Goal.findById(goalId);
      expect(goal).toBeNull();
    });

    it('should throw error for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(deleteGoal(mockUserId, fakeId))
        .rejects
        .toThrow('Goal not found or user not authorized');
    });
  });
});
