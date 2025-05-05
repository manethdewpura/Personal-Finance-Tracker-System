import { jest } from '@jest/globals';
import axios from 'axios';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../../services/transactions.service.js';
import Transaction from '../../models/transactions.model.js';
import mongoose from 'mongoose';
import Report from '../../models/reports.model.js';
import Category from '../../models/categories.model.js'; // Add this line to register the Category model

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the currency conversion utility
jest.mock('../../utils/currency.utils.js', () => ({
  convertToCurrency: jest.fn().mockResolvedValue(100),
}));

// Mock axios
jest.mock('axios');

describe('Transaction Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockTransactionData = {
    type: 'expense',
    amount: 100,
    description: 'Test Transaction',
    category: new mongoose.Types.ObjectId(),
    tags: new mongoose.Types.ObjectId(),
    budget: new mongoose.Types.ObjectId(),
    goal: new mongoose.Types.ObjectId(),
  };

  beforeAll(() => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        rates: {
          USD: 1,
        },
      },
    });
  });

  beforeEach(async () => {
    await Report.deleteMany({});
    await Transaction.deleteMany({});
  });

  describe('createTransaction', () => {

    it('should throw an error if transaction creation fails', async () => {
      const mockUser = { _id: mockUserId, currency: 'USD' };
      const transactionData = { ...mockTransactionData, currency: 'USD' };

      jest.spyOn(Transaction, 'create').mockImplementationOnce(() => {
        throw new Error('Transaction creation failed');
      });

      await expect(createTransaction(mockUser, transactionData))
        .rejects
        .toThrow('Transaction creation failed');
    });
  });

  describe('updateTransaction', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({ ...mockTransactionData, user: mockUserId });
      transactionId = transaction._id;
    });

    it('should update an existing transaction', async () => {
      const updatedData = { amount: 150 };
      const updated = await updateTransaction(mockUserId, transactionId, updatedData);
      expect(updated.amount).toBe(150);
    });

    it('should throw error for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(updateTransaction(mockUserId, fakeId, {}))
        .rejects
        .toThrow('Transaction not found or user not authorized');
    });
  });

  describe('deleteTransaction', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({ ...mockTransactionData, user: mockUserId });
      transactionId = transaction._id;
    });

    it('should throw error for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(deleteTransaction(mockUserId, fakeId))
        .rejects
        .toThrow('Transaction not found or user not authorized');
    });
  });
});
