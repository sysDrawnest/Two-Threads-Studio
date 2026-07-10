"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHealth = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const prisma_1 = __importDefault(require("../prisma"));
const env_1 = require("../config/env");
exports.checkHealth = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Check Database Status
    let dbStatus = 'disconnected';
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        dbStatus = 'connected';
    }
    catch (error) {
        dbStatus = 'error';
    }
    res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
        database: dbStatus,
        version: '1.0.0',
    });
});
