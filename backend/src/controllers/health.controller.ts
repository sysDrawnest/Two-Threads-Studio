import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../prisma';
import { env } from '../config/env';
import { successResponse } from '../utils/response';
import { cacheService } from '../services/cache.service';

export const checkHealth = catchAsync(async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  const mem = process.memoryUsage();

  const metrics = {
    service: 'Two Threads Studio API',
    version: process.env['npm_package_version'] || '1.0.0',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    cache: cacheService.getStats(),
    shippingProvider: env.SHIPPING_PROVIDER,
    timestamp: new Date().toISOString(),
    memoryUsageMB: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    },
    nodeVersion: process.version,
  };

  return successResponse(res, metrics, 'System health check completed');
});
