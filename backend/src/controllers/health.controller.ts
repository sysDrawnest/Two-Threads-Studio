import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../prisma';
import { env } from '../config/env';

export const checkHealth = catchAsync(async (req: Request, res: Response) => {
  // Check Database Status
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    database: dbStatus,
    version: '1.0.0',
  });
});
