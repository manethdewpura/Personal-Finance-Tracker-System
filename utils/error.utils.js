import { logger } from './winston.utils.js';

function ThrowError(error) {
  logger.error(error.toString());
  return error;
}

export default ThrowError;
