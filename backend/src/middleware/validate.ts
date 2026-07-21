import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) {
        Object.defineProperty(req, 'query', { value: parsed.query, writable: true, configurable: true });
      }
      if (parsed.params !== undefined) {
        Object.defineProperty(req, 'params', { value: parsed.params, writable: true, configurable: true });
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // We can format the Zod error to be more readable
        const formattedErrors = error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        const firstMessage = formattedErrors[0]?.message || MESSAGES.VALIDATION_ERROR;
        return next(
          new AppError(
            firstMessage,
            HTTP_STATUS.BAD_REQUEST,
            'VALIDATION_ERROR',
            formattedErrors
          )
        );
      }
      return next(error);
    }
  };
