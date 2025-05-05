import { logger } from "../utils/winston.utils.js";
import {createTransaction, getTransactions, updateTransaction, deleteTransaction } from "../services/transactions.service.js";

const createTransactionController = async (req, res) => {
    logger.info("TransactionController - createTransactionController");
    try {
        const user = res.locals.user;
        const transactionData = req.body;

        const transaction = await createTransaction(user,transactionData);
        logger.info("Transaction created successfully");
        res.status(201).json(transaction);
    } catch (error) {
        logger.error("Error creating transaction");
        res.status(400).json({ message: error.message });
    }
}

const getTransactionsController = async (req, res) => {
    logger.info("TransactionController - getTransactionsController");
    try {
        const userId = res.locals.user.id;
        const start = parseInt(req?.query?.start, 10) || 0;
        const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
        const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
        const filter = JSON.parse(req?.query?.filter || "{}");

        const transactions = await getTransactions(userId, start, limit, order, filter);

        logger.info("Fetched all transactions");
        res.json(transactions);
    } catch (error) {
        logger.error("Error fetching transactions");
        res.status(500).json({ message: error.message });
    }
}

const updateTransactionController = async (req, res) => {
    logger.info("TransactionController - updateTransactionController");
    try {
        const userId = res.locals.user.id;
        const transaction = await updateTransaction(userId, req.params.id, req.body);
        logger.info("Transaction updated successfully");
        res.json(transaction);
    } catch (error) {
        logger.error("Error updating transaction");
        res.status(400).json({ message: error.message });
    }
}

const deleteTransactionController = async (req, res) => {
    logger.info("TransactionController - deleteTransactionController");
    try {
        const userId = res.locals.user.id;
        await deleteTransaction(userId, req.params.id);
        logger.info("Transaction deleted successfully");
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        logger.error("Error deleting transaction");
        res.status(400).json({ message: error.message });
    }
}

export { createTransactionController, getTransactionsController, updateTransactionController, deleteTransactionController };