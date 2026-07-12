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
      req.body = parsed.body;
      Object.defineProperty(req, 'query', { value: parsed.query, writable: true, configurable: true });
      Object.defineProperty(req, 'params', { value: parsed.params, writable: true, configurable: true });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // We can format the Zod error to be more readable
        const formattedErrors = error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        return next(
          new AppError(
            MESSAGES.VALIDATION_ERROR,
            HTTP_STATUS.BAD_REQUEST,
            formattedErrors
          )
        );
      }
      return next(error);
    }
  };
