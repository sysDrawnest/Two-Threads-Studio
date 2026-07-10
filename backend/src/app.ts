import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

import { corsConfig } from './config/cors';
import { limiter } from './config/rateLimit';
import { swaggerConfig } from './config/swagger';
import logger from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import routes from './routes';
import { BASE_API_PATH } from './constants/api';
import { HTTP_STATUS } from './constants/httpStatus';
import { successResponse } from './utils/response';

const app: Application = express();

// Trust proxy if behind a load balancer (e.g., Railway, Heroku)
app.set('trust proxy', 1);

// 1. GLOBAL MIDDLEWARES
// Security HTTP headers
app.use(helmet());

// CORS
app.use(cors(corsConfig));

// Rate limiting
app.use(BASE_API_PATH, limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data compression
app.use(compression());

// Request ID & Structured logging
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const id = req.headers['x-request-id'] || randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    autoLogging: {
      ignore: (req) => req.url === `${BASE_API_PATH}/health` || req.url === '/',
    },
  })
);

// 2. ROUTES
// Basic root endpoint
app.get('/', (_req: Request, res: Response) => {
  return successResponse(res, {
    service: 'Two Threads Studio Backend',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Routes (versioned)
app.use(BASE_API_PATH, routes);

// Swagger Documentation
app.use('/docs', swaggerConfig.serve, swaggerConfig.setup);

// 3. UNHANDLED ROUTES
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found`, HTTP_STATUS.NOT_FOUND));
});

// 4. GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
