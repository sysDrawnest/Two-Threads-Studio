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
import { env } from './config/env';
import logger from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import routes from './routes';
import webhookRoutes from './routes/webhook.routes';
import './events';
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

// ── Webhook route: MUST use raw body BEFORE JSON parser ──────────────────
// Razorpay HMAC verification requires the raw Buffer body.
// If express.json() runs first, the Buffer is destroyed.
app.use('/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Body parser, reading data from body into req.body (10MB for rich product payloads/images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

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
    customProps: (req) => {
      return {
        userRole: (req as any).user?.role || 'Guest',
        userEmail: (req as any).user?.email || null,
      };
    },
    serializers: {
      req: (req: any) => {
        const rawReq = req.raw || req;
        const serialized: any = {
          method: rawReq.method,
          url: rawReq.url,
          remoteAddress: rawReq.socket?.remoteAddress || rawReq.ip || '::1',
        };
        if (env.LOG_HTTP_BODY && rawReq.body) {
          const bodyCopy = { ...rawReq.body };
          if (bodyCopy.password) bodyCopy.password = '******';
          if (bodyCopy.newPassword) bodyCopy.newPassword = '******';
          if (bodyCopy.currentPassword) bodyCopy.currentPassword = '******';
          serialized.body = bodyCopy;
        }
        if (env.LOG_HEADERS) {
          serialized.headers = rawReq.headers;
        }
        return serialized;
      },
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
