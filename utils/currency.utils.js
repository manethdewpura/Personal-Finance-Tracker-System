import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from './winston.utils.js';

dotenv.config();

export const convertToCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        if (fromCurrency === toCurrency) return amount;

        const response = await axios.get(`${process.env.EXCHANGERATE}${fromCurrency}`);
        const rate = response.data.rates[toCurrency];
        
        if (!rate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
        }

        return amount * rate;
    } catch (error) {
        logger.error(`Error converting currency: ${error.message}`);
        throw error;
    }
};
