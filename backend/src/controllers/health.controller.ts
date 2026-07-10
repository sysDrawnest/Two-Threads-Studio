import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../prisma';
import { env } from '../config/env';
import { successResponse } from '../utils/response';

export const checkHealth = catchAsync(async (req: Request, res: Response) => {
  // Check Database Status
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  const metrics = {
    service: 'Two Threads Studio API',
    version: process.env.npm_package_version || '1.0.0',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
  };

  return successResponse(res, metrics, 'System is healthy');
});
