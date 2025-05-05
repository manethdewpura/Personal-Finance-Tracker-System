import { logger } from "../utils/winston.utils.js";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../services/goals.service.js";

const createGoalController = async (req, res) => {
  logger.info("GoalController - createGoalController");
  try {
    const user = res.locals.user;
    const goalData = req.body;

    const goal = await createGoal(user.id, goalData);

    logger.info("Goal created successfully");
    res.status(201).json(goal);
  } catch (error) {
    logger.error("Error creating goal");
    res.status(400).json({ message: error.message });
  }
};

const getGoalsController = async (req, res) => {
  logger.info("GoalController - getGoalsController");
  try {
    const userId = res.locals.user.id;
    const start = parseInt(req?.query?.start, 10) || 0;
    const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
    const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
    const filter = JSON.parse(req?.query?.filter || "{}");

    const goals = await getGoals(userId, start, limit, order, filter);
    logger.info("Fetched all goals");
    res.json(goals);
  } catch (error) {
    logger.error("Error fetching goals");
    res.status(500).json({ message: error.message });
  }
};

const updateGoalController = async (req, res) => {
  logger.info("GoalController - updateGoalController");
  try {
    const userId = res.locals.user.id;
    const goal = await updateGoal(userId, req.params.id, req.body);
    logger.info("Goal updated successfully");
    res.json(goal);
  } catch (error) {
    logger.error("Error updating goal");
    res.status(400).json({ message: error.message });
  }
};

const deleteGoalController = async (req, res) => {
  logger.info("GoalController - deleteGoalController");
  try {
    const userId = res.locals.user.id;
    await deleteGoal(userId, req.params.id);
    logger.info("Goal deleted successfully");
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    logger.error("Error deleting goal");
    res.status(400).json({ message: error.message });
  }
};

export {
  createGoalController,
  getGoalsController,
  updateGoalController,
  deleteGoalController,
};
