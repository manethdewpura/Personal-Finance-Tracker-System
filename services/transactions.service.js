import Transaction from "../models/transactions.model.js";
import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import { sendNotification } from "./notification.service.js";
import pkg from "lodash";
import cron from "node-cron";
import Goal from "../models/goals.model.js";
import Budget from "../models/budget.model.js";
import Report from "../models/reports.model.js"; // Add this line
const { debounce } = pkg;
import { updateGoal } from "./goals.service.js";
import { updateBudget } from "./budget.service.js";
import dotenv from "dotenv";
import { convertToCurrency } from "../utils/currency.utils.js";
import { updateReportById, createReport } from "./reports.service.js";

dotenv.config();

const processRecurringTransactions = async () => {
  logger.info("TransactionService - processRecurringTransactions");

  try {
    const now = new Date();
    const transactions = await Transaction.find({
      "recurring.interval": { $ne: null },

      "recurring.nextOccurrence": { $lte: now },
    }).limit(100);

    const newTransactions = [];

    const debouncedSendNotification = debounce(sendNotification, 300);

    for (const transaction of transactions) {
      let nextOccurrence = transaction.recurring.nextOccurrence;

      while (nextOccurrence && nextOccurrence <= now) {
        if (
          transaction.recurring.endDate &&
          nextOccurrence > transaction.recurring.endDate
        ) {
          break;
        }

        const newTransaction = new Transaction({
          user: transaction.user,
          type: transaction.type,
          amount: transaction.amount,
          tags: transaction.tags,
          budget: transaction.budget,
          goal: transaction.goal,
          description: transaction.description,
          recurring: transaction.recurring,
        });

        const goal = await Goal.findById(transaction.goal);
        if (goal) {
          await updateGoal(transaction.user, goal._id, {
            currentAmount: goal.currentAmount + transaction.amount,
          });
        }
        const budget = await Budget.findById(transaction.budget);
        if (budget) {
          await updateBudget(transaction.user, budget._id, {
            spentAmount: budget.spentAmount + transaction.amount,
          });
        }

        // Update report
        const report = await Report.findOne({ user: transaction.user });
        if (report) {
          if (transaction.type === "income") {
            report.totalIncome += transaction.amount;
          } else if (transaction.type === "expense") {
            report.totalExpense += transaction.amount;
          }
          report.totalSavings = report.totalIncome - report.totalExpense;
          await report.save();
        }

        newTransactions.push(newTransaction);
        debouncedSendNotification(transaction.user, newTransaction);

        transaction.recurring.nextOccurrence = transaction.getNextOccurrence();
        nextOccurrence = transaction.recurring.nextOccurrence;
      }
    }

    if (newTransactions.length > 0) {
      for (const newTransaction of newTransactions) {
        debouncedSendNotification(newTransaction.user, newTransaction);
      }
    }

    await Transaction.insertMany(newTransactions);
    await Promise.all(transactions.map((transaction) => transaction.save()));
  } catch (error) {
    logger.error("Error processing recurring transactions: ", error);
    ThrowError(error);
  }
};

// Schedule to run at midnight every day
cron.schedule("0 0 * * *", () => {
  logger.info("Running scheduled task: processRecurringTransactions");
  processRecurringTransactions();
});

const createTransaction = async (user, transactionData) => {
  logger.info("TransactionService - createTransaction");

  try {
    const userDefaultCurrency = user.currency;
    const convertedAmount = await convertToCurrency(
      transactionData.amount,
      transactionData.currency,
      userDefaultCurrency
    );
    transactionData.amount = convertedAmount;
    transactionData.currency = userDefaultCurrency;

    if (transactionData.goal !== null) {
      const goal = await Goal.findById(transactionData.goal);
      if (goal) {
        updateGoal(user._id, goal._id, {
          currentAmount: goal.currentAmount + transactionData.amount,
        });
      }
    }
    if (transactionData.budget !== null) {
      const budget = await Budget.findById(transactionData.budget);
      if (budget) {
        updateBudget(user._id, budget._id, {
          spentAmount: budget.spentAmount + transactionData.amount,
        });
      }
    }

    const transaction = await Transaction.create({
      user: user._id,
      ...transactionData,
    });

    // Update report
    const report = await Report.findOne({ user: user._id });
    if (!report) {
      await createReport({
        user: user._id,
        totalIncome: 0,
        totalExpense: 0,
        totalSavings: 0,
      });
    }
    const updatedReport = await updateReportById(report._id, {
      user: user._id,
      totalIncome:
        transactionData.type === "income"
          ? report.totalIncome + transactionData.amount
          : report.totalIncome,
      totalExpense:
        transactionData.type === "expense"
          ? report.totalExpense + transactionData.amount
          : report.totalExpense,
      totalSavings: report.totalIncome - report.totalExpense,
    });

    logger.info("Created new transaction");
    return transaction;
  } catch (error) {
    logger.error("Error creating transaction");
    throw error;
  }
};

const getTransactions = async (userId, start, limit, order, filter) => {
  logger.info("TransactionService - getTransactions");

  try {
    const transactions = await Transaction.find({ user: userId, ...filter })
      .populate("category")
      .populate("tags")
      .populate("goal")
      .populate("budget")
      .sort(order)
      .skip(start)
      .limit(limit);

    logger.info("Fetched all transactions");
    return transactions;
  } catch (error) {
    logger.error("Error fetching transactions");
    throw ThrowError(error);
  }
};

const updateTransaction = async (userId, id, transactionData) => {
  logger.info(`TransactionService - updateTransaction`);

  try {
    logger.info(`Updating transaction with ID: ${id}`);

    // Update report
    const report = await Report.findOne({ user: userId });
    const oldTransaction = await Transaction.findById(id);
    if (!report) {
      await createReport({
      user: userId,
      totalIncome: 0,
      totalExpense: 0,
      totalSavings: 0,
      });
    } else {
      if (transactionData.type === "income") {
      report.totalIncome -= oldTransaction.amount;
      report.totalIncome += transactionData.amount;
      } else if (transactionData.type === "expense") {
      report.totalExpense -= oldTransaction.amount;
      report.totalExpense += transactionData.amount;
      }
      report.totalSavings = report.totalIncome - report.totalExpense;
      await report.save();
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      transactionData,
      { new: true }
    );
    if (!transaction) {
      throw new Error("Transaction not found or user not authorized");
    }

    return transaction;
  } catch (error) {
    logger.error(`Error updating transaction with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteTransaction = async (userId, id) => {
  logger.info(`TransactionService - deleteTransaction`);

  try {
    logger.info(`Deleting transaction with ID: ${id}`);
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!transaction) {
      throw new Error("Transaction not found or user not authorized");
    }

    // Update report
    const report = await Report.findOne({ user: userId });
    if (!report) {
      await createReport({
        user: user._id,
        totalIncome: 0,
        totalExpense: 0,
        totalSavings: 0,
      });
    }
    const updatedReport = await updateReportById(report._id, {
      user: userId,
      totalIncome:
        transaction.type === "income"
          ? report.totalIncome - transaction.amount
          : report.totalIncome,
      totalExpense:
        transaction.type === "expense"
          ? report.totalExpense - transaction.amount
          : report.totalExpense,
      totalSavings: report.totalIncome - report.totalExpense,
    });

    return true;
  } catch (error) {
    logger.error(`Error deleting transaction with ID: ${id}`);
    throw ThrowError(error);
  }
};

export {
  processRecurringTransactions,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
