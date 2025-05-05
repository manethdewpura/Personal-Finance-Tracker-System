import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../services/budget.service.js";
import { logger } from "../utils/winston.utils.js";

const createBudgetController = async (req, res, next) => {
  logger.info("BudgetController - createBudgetController");
  try {
    const { name, amount, description, category } = req.body;
    const user = res.locals.user;

    const newBudget = await createBudget({
      user: user.id,
      name,
      amount,
      description,
      category,
    });

    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBudgetsController = async (req, res, next) => {
  logger.info("BudgetController - getBudgetsController");

  const userId = res.locals.user.id;
  const start = parseInt(req?.query?.start, 10) || 0;
  const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
  const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
  const filter = JSON.parse(req?.query?.filter || "{}");
  try {
    const budgets = await getBudgets(userId, start, limit, order, filter);
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

const updateBudgetController = async (req, res, next) => {
  logger.info("BudgetController - updateBudgetController");
  try {
    const { name, amount, description, category } = req.body;
    const id = req.params.id;
    const userId = res.locals.user.id;

    const updatedBudget = await updateBudget(userId,id, {
      user: userId,
      name,
      amount,
      description,
      category,
    });

    res.json(updatedBudget);
  } catch (error) {
    next(error);
  }
};

const deleteBudgetController = async (req, res, next) => {
  logger.info("BudgetController - deleteBudgetController");
  try {
    const id = req.params.id;
    const userId = res.locals.user.id;

    const deletedBudget = deleteBudget(userId, id);
    if (!deletedBudget)
      return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  createBudgetController,
  getBudgetsController,
  updateBudgetController,
  deleteBudgetController,
};
