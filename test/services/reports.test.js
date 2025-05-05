import { jest } from '@jest/globals';
import { createReport, getReportById, getReportsByUserId, updateReportById, deleteReportById } from '../../services/reports.service.js';
import Report from '../../models/reports.model.js';
import mongoose from 'mongoose';
import User from '../../models/user.model.js'; // Ensure User model is registered

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Report Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockReportData = {
    user: mockUserId,
    totalSavings: 1000,
    totalExpense: 500,
    totalIncome: 1500,
  };

  describe('createReport', () => {
    it('should create a new report', async () => {
      const report = await createReport(mockReportData);
      expect(report.user).toEqual(mockUserId);
      expect(report.totalSavings).toBe(mockReportData.totalSavings);
    });
  });

  describe('getReportById', () => {
    let reportId;

    beforeEach(async () => {
      const report = await Report.create(mockReportData);
      reportId = report._id;
    });

    it('should get a report by ID', async () => {
      const report = await getReportById(reportId);
      expect(report._id).toEqual(reportId);
      expect(report.user).toEqual(mockUserId);
    });

    it('should throw error for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(getReportById(fakeId))
        .rejects
        .toThrow("Report not found");
    });
  });

  describe('getReportsByUserId', () => {
    beforeEach(async () => {
      await Report.create(mockReportData);
      await Report.create({ ...mockReportData, totalSavings: 2000 });
    });

    it('should get all reports for a user', async () => {
      const reports = await getReportsByUserId(mockUserId, { start: 0, limit: 10, order: { createdAt: -1 }, filter: {} });
      expect(reports).toHaveLength(2);
      expect(reports[0].user).toEqual(mockUserId);
    });
  });

  describe('updateReportById', () => {
    let reportId;

    beforeEach(async () => {
      const report = await Report.create(mockReportData);
      reportId = report._id;
    });

    it('should update an existing report', async () => {
      const updatedData = { totalSavings: 2000 };
      const updated = await updateReportById(reportId, updatedData);
      expect(updated.totalSavings).toBe(2000);
    });

    it('should throw error for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(updateReportById(fakeId, {}))
        .rejects
        .toThrow('Error updating report');
    });
  });

  describe('deleteReportById', () => {
    let reportId;

    beforeEach(async () => {
      const report = await Report.create(mockReportData);
      reportId = report._id;
    });

    it('should delete an existing report', async () => {
      const result = await deleteReportById(reportId);
      expect(result).toBe(true);
      const report = await Report.findById(reportId);
      expect(report).toBeNull();
    });

    it('should throw error for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(deleteReportById(fakeId))
        .rejects
        .toThrow('Report not found');
    });
  });

  // Add cleanup after each test
  afterEach(async () => {
    await Report.deleteMany({});
  });
});

