import budget from "../models/budget.model.js";
import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import { sendNotification } from "./notification.service.js"; // Import sendNotification

const createBudget = async (budgetData) => {
  logger.info("BudgetService - createBudget");
  try {
    logger.info("Creating new budget");
    return await budget.create(budgetData);
  } catch (error) {
    logger.error("Error creating budget");
    throw ThrowError(error);
  }
};

const getBudgets = async (userId, start, limit, order, filter) => {
  logger.info("BudgetService - getBudgets");
  try {

    const budgets = await budget
      .find({ user:userId, ...filter })
      .populate("category")
      .sort(order)
      .skip(start)
      .limit(limit);

    logger.info("Fetched all budgets");
    return budgets;
  } catch (error) {
    logger.error("Error fetching budgets");
    throw ThrowError(error);
  }
};

const updateBudget = async (userId, id, budgetData) => {
  logger.info(`BudgetService - updateBudget`);
  try {
    logger.info(`Updating budget with ID: ${id}`);
    const budgetToUpdate = await budget.findOne({ _id: id, user: userId });
    if (!budgetToUpdate) {
      throw new Error("Budget not found or user not authorized");
    }
    const updatedBudget = await budget.findByIdAndUpdate(id, budgetData, { new: true });

    const totalSpent = budgetToUpdate.spending.reduce((acc, item) => acc + item.spentAmount, 0);
    if (totalSpent >= budgetToUpdate.amount * 0.9) {
      await sendNotification(userId, {
        description: `You have spent 90% of your budget: ${budgetToUpdate.name}`,
        _id: id
      });
    }

    return updatedBudget;
  } catch (error) {
    logger.error(`Error updating budget with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteBudget = async (userId, id) => {
  logger.info(`BudgetService - deleteBudget`);
  try {
    logger.info(`Deleting budget with ID: ${id}`);
    const budgetToDelete = await budget.findOne({ _id: id, user: userId });
    if (!budgetToDelete) {
      throw new Error("Budget not found or user not authorized");
    }
    await budget.findByIdAndDelete(id);
    return true;
  } catch (error) {
    logger.error(`Error deleting budget with ID: ${id}`);
    throw ThrowError(error);
  }
};

export { createBudget, getBudgets, updateBudget, deleteBudget };
