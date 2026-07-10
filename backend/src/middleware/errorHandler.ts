import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let details: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.isOperational ? undefined : err.name;
    // AppError might have data/errors attached, if we implement that
  }

  const errorObj = {
    name: err.name,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  req.log.error({ err, path: req.originalUrl }, err.message);

  return errorResponse(res, message, statusCode, errorObj, req.originalUrl);
};
