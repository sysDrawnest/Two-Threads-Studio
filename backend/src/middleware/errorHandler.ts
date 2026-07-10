import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const response = {
    success: false,
    message,
    error: err.name,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  req.log.error({ err, path: req.originalUrl }, err.message);

  res.status(statusCode).json(response);
};
