import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import pino from 'pino';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import routes from './routes';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
});

const app: Application = express();

// Trust proxy if behind a load balancer (e.g., Railway, Heroku)
app.set('trust proxy', 1);

// 1. GLOBAL MIDDLEWARES
// Security HTTP headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data compression
app.use(compression());

// Structured logging
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/api/health' || req.url === '/',
    },
  })
);

// 2. ROUTES
// Basic root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: 'Two Threads Studio Backend',
    version: '1.0.0',
  });
});

// API Routes (versioned)
app.use('/api/v1', routes);

// Swagger Documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Two Threads Studio API',
    version: '1.0.0',
    description: 'API Documentation for Two Threads Studio Backend',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: 'Development server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Check API Health',
        responses: {
          '200': {
            description: 'Successful response',
          },
        },
      },
    },
  },
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. UNHANDLED ROUTES
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
