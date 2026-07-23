import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let code: string | undefined = undefined;
  let details: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.isOperational ? undefined : err.name;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Transform Prisma errors into readable client HTTP errors
    if (err.code === 'P2002') {
      statusCode = HTTP_STATUS.CONFLICT;
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      message = `A record with this ${target} already exists.`;
      code = 'DUPLICATE_ENTRY';
    } else if (err.code === 'P2003') {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      const field = (err.meta?.field_name as string) || 'referenced entity';
      message = `Invalid relationship: The specified ${field} does not exist.`;
      code = 'INVALID_FOREIGN_KEY';
    } else if (err.code === 'P2025') {
      statusCode = HTTP_STATUS.NOT_FOUND;
      message = 'Requested record was not found in database.';
      code = 'NOT_FOUND';
    } else {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Database operation error: ${err.message}`;
      code = 'DATABASE_ERROR';
    }
  }

  const errorObj = {
    name: err.name,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  req.log.error({ err, path: req.originalUrl }, err.message);

  return errorResponse(res, message, statusCode, code, errorObj, req.originalUrl);
};
