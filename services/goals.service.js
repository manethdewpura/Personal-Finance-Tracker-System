import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import Goal from "../models/goals.model.js";
import cron from 'node-cron';
import { createTransaction } from './transactions.service.js';
import User from '../models/user.model.js'; // Import the User model

const createGoal = async (userId, goalData) => {
  logger.info("GoalService - createGoal");
  try {
    logger.info("Creating new goal");
    const { user, ...sanitizedData } = goalData;
    return await Goal.create({ user: userId, ...sanitizedData });
  } catch (error) {
    logger.error("Error creating goal");
    throw ThrowError(error);
  }
};

const getGoals = async (userId, start, limit, order, filter) => {
  logger.info("GoalService - getGoals");
  try {
    const goals = await Goal.find({ user: userId, ...filter })
      .sort(order)
      .skip(start)
      .limit(limit)
      .exec();

    logger.info("Fetched all goals");
    return goals;
  } catch (error) {
    logger.error("Error fetching goals");
    throw ThrowError(error);
  }
};

const updateGoal = async (userId, id, goalData) => {
  logger.info(`GoalService - updateGoal`);
  try {
    logger.info(`Updating goal with ID: ${id}`);
    const { user, ...sanitizedData } = goalData;
    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: userId },
      sanitizedData,
      { new: true }
    );
    if (!goal) throw new Error("Goal not found or user not authorized");
    return goal;
  } catch (error) {
    logger.error(`Error updating goal with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteGoal = async (userId, id) => {
  logger.info(`GoalService - deleteGoal`);
  try {
    logger.info(`Deleting goal with ID: ${id}`);
    const goal = await Goal.findOneAndDelete({ _id: id, user: userId });
    if (!goal) {
      throw new Error("Goal not found or user not authorized");
    }
    return true;
  } catch (error) {
    logger.error(`Error deleting goal with ID: ${id}`);
    throw ThrowError(error);
  }
};

const allocateSavings = async (userId) => {
  logger.info("GoalService - allocateSavings");
  try {
    const goal = await Goal.findOne({ user: userId, description: "Automatic savings allocation" });
    if (goal) {
      goal.currentAmount += goal.monthlyContribution;
      await goal.save();

      const transactionData = {
        user: userId,
        type: 'expense',
        amount: goal.monthlyContribution,
        description: `Allocated savings for ${goal.name}`,
        goal: goal._id,
        category: null,
        tags: null,
        budget: null,
      };
      await createTransaction({ _id: userId }, transactionData);

      return goal;
    } else {
      throw new Error("Automatic savings goal not found");
    }
  } catch (error) {
    logger.error("Error allocating savings");
    throw ThrowError(error);
  }
};

cron.schedule('0 0 1 * *', async () => {
  logger.info("Running monthly savings allocation job");
  try {
    const userIds = await getAllUserIds();
    for (const userId of userIds) {
      await allocateSavings(userId);
    }
    logger.info("Monthly savings allocation job completed successfully");
  } catch (error) {
    logger.error("Error running monthly savings allocation job", error);
  }
});

const getAllUserIds = async () => {
  try {
    const users = await User.find().select('_id').exec();
    return users.map(user => user._id);
  } catch (error) {
    logger.error("Error fetching user IDs", error);
    throw ThrowError(error);
  }
};

export { createGoal, getGoals, updateGoal, deleteGoal, allocateSavings };
