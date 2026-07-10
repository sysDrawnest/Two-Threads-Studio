"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    const response = {
        success: false,
        message,
        error: err.name,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        ...(env_1.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    req.log.error({ err, path: req.originalUrl }, err.message);
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
