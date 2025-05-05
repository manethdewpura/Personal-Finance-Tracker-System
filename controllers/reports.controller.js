import { getReportsByUserId, getAllReports } from "../services/reports.service.js";

// Route to get reports by user ID
const getReportsByUserIdcontroller = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const start = parseInt(req?.query?.start, 10) || 0;
    const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
    const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
    const filter = JSON.parse(req?.query?.filter || "{}");

    const reports = await getReportsByUserId(userId, {
      start,
      limit,
      order,
      filter,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getAllReportsController = async (req, res) => {
    try {
        const start = parseInt(req?.query?.start, 10) || 0;
        const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
        const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
        const filter = JSON.parse(req?.query?.filter || "{}");
    
        const reports = await getAllReports({ start, limit, order, filter });
        res.status(200).json(reports);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
    };

export { getReportsByUserIdcontroller, getAllReportsController };
