export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly data?: any;

  constructor(message: string, statusCode: number, code?: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.data = data;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

