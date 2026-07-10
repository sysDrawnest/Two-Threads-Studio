import pino from 'pino';
import { loggerConfig } from '../config/logger';

const logger = pino(loggerConfig);

export default logger;
