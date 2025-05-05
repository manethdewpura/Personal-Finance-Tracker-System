import { jest } from '@jest/globals';
import { createBudget, getBudgets, updateBudget, deleteBudget } from '../../services/budget.service.js';
import Budget from '../../models/budget.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the Categories model
jest.mock('../../models/categories.model.js', () => {
  return {
    find: jest.fn().mockResolvedValue([]),
  };
});

describe('Budget Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockCategoryId = new mongoose.Types.ObjectId(); // Add category ID
  const mockBudgetData = {
    user: mockUserId,
    name: 'Food Budget', // Add required name field
    amount: 1000,
    category: mockCategoryId, // Use ObjectId instead of string
    month: '2023-10',
    description: 'Monthly food budget'
  };

  describe('createBudget', () => {
    it('should create a new budget', async () => {
      const budget = await createBudget(mockBudgetData);
      expect(budget.user).toEqual(mockUserId);
      expect(budget.amount).toBe(mockBudgetData.amount);
      expect(budget.category).toBe(mockBudgetData.category);
    });
  });

  describe('updateBudget', () => {
    let budgetId;

    beforeEach(async () => {
      const budget = await Budget.create(mockBudgetData);
      budgetId = budget._id;
    });

    it('should update an existing budget', async () => {
      const updatedData = { amount: 1500 };
      const updated = await updateBudget(mockUserId, budgetId, updatedData);
      expect(updated.amount).toBe(1500);
    });

    it('should throw error for non-existent budget', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(updateBudget(mockUserId, fakeId, {}))
        .rejects
        .toThrow('Budget not found or user not authorized');
    });
  });

  describe('deleteBudget', () => {
    let budgetId;

    beforeEach(async () => {
      const budget = await Budget.create(mockBudgetData);
      budgetId = budget._id;
    });

    it('should delete an existing budget', async () => {
      const result = await deleteBudget(mockUserId, budgetId);
      expect(result).toBe(true);
      const budget = await Budget.findById(budgetId);
      expect(budget).toBeNull();
    });

    it('should throw error for non-existent budget', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(deleteBudget(mockUserId, fakeId))
        .rejects
        .toThrow('Budget not found or user not authorized');
    });
  });

  afterEach(async () => {
    await Budget.deleteMany({});
  });
});
