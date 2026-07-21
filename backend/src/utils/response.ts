import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  code?: string;
  message: string;
  error?: any;
  path?: string;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = MESSAGES.SUCCESS,
  statusCode: number = HTTP_STATUS.OK
) => {
  const payload: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
};

export const errorResponse = (
  res: Response,
  message: string = MESSAGES.INTERNAL_SERVER_ERROR,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code?: string,
  error?: any,
  path?: string
) => {
  const payload: ErrorResponse = {
    success: false,
    ...(code && { code }),
    message,
    ...(error && { error }),
    ...(path && { path }),
  };
  return res.status(statusCode).json(payload);
};
