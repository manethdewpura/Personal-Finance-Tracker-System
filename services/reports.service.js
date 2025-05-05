import Report from "../models/reports.model.js";
import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";

// Create a new report
export const createReport = async (reportData) => {
    try {
        const report = await Report.create(reportData);
        logger.info(`Report created with ID: ${report._id}`);
        return report;
    } catch (error) {
        logger.error("Error creating report: " + error.message);
        throw ThrowError("Error creating report", 500);
    }
};

// Get a report by ID
export const getReportById = async (reportId) => {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            logger.warn(`Report not found with ID: ${reportId}`);
            throw new Error("Report not found");
        }
        logger.info(`Report fetched with ID: ${report._id}`);
        return report;
    } catch (error) {
        logger.error("Error fetching report: " + error.message);
        throw new Error(error.message.includes("Report not found") ? "Report not found" : "Error fetching report");
    }
};

// Get reports by user ID
export const getReportsByUserId = async (userId, { start, limit, order, filter }) => {
    try {
        const reports = await Report.find({ user: userId, ...filter })
            .sort(order)
            .skip(start)
            .limit(limit);
        if (!reports.length) {
            logger.warn(`No reports found for user ID: ${userId}`);
            throw new Error("No reports found");
        }
        logger.info(`Reports fetched for user ID: ${userId}`);
        return reports;
    } catch (error) {
        logger.error("Error fetching reports: " + error.message);
        throw new Error("Error fetching reports");
    }
};

export const getAllReports = async ({ start, limit, order, filter }) => {
    try {
        const reports = await Report.find(filter)
            .sort(order)
            .skip(start)
            .limit(limit);
        if (!reports.length) {
            logger.warn("No reports found");
            throw new Error("No reports found");
        }
        logger.info("Reports fetched");
        return reports;
    } catch (error) {
        logger.error("Error fetching reports: " + error.message);
        throw new Error("Error fetching reports");
    }
};

// Update a report by ID
export const updateReportById = async (reportId, updateData) => {
    try {
        let report = null;
        report = await Report.findById(reportId);
        if (!report) {
            logger.warn(`Report not found with ID: ${reportId}, creating a new one.`);
            report = await Report.create({ _id: reportId, ...updateData });
            logger.info(`New report created with ID: ${report._id}`);
        } else {
            report = await Report.findByIdAndUpdate(reportId, updateData, { new: true });
            logger.info(`Report updated with ID: ${report._id}`);
        }
        return report;
    } catch (error) {
        logger.error("Error updating report: " + error.message);
        throw new Error(error.message.includes("Report not found") ? "Report not found" : "Error updating report");
    }
};

// Delete a report by ID
export const deleteReportById = async (reportId) => {
    try {
        const report = await Report.findByIdAndDelete(reportId);
        if (!report) {
            logger.warn(`Report not found with ID: ${reportId}`);
            throw new Error("Report not found");
        }
        logger.info(`Report deleted with ID: ${report._id}`);
        return true;
    } catch (error) {
        logger.error("Error deleting report: " + error.message);
        throw new Error(error.message.includes("Report not found") ? "Report not found" : "Error deleting report");
    }
};
