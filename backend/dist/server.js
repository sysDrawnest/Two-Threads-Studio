"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importStar(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = __importDefault(require("./prisma"));
const startServer = async () => {
    try {
        // Attempt database connection
        await prisma_1.default.$connect();
        app_1.logger.info('✅ Successfully connected to Supabase PostgreSQL');
        // Start Express server
        const server = app_1.default.listen(env_1.env.PORT, () => {
            app_1.logger.info(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
        });
        // Graceful Shutdown
        const gracefulShutdown = async () => {
            app_1.logger.info('🛑 Received kill signal, shutting down gracefully...');
            server.close(async () => {
                app_1.logger.info('💤 Closed out remaining connections');
                await prisma_1.default.$disconnect();
                process.exit(0);
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                app_1.logger.error('⚠️ Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    }
    catch (error) {
        app_1.logger.error({ err: error }, '❌ Failed to start server or connect to database');
        process.exit(1);
    }
};
startServer();
