"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const pino_1 = __importDefault(require("pino"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const AppError_1 = require("./utils/AppError");
const routes_1 = __importDefault(require("./routes"));
exports.logger = (0, pino_1.default)({
    level: env_1.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: env_1.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
        }
        : undefined,
});
const app = (0, express_1.default)();
// Trust proxy if behind a load balancer (e.g., Railway, Heroku)
app.set('trust proxy', 1);
// 1. GLOBAL MIDDLEWARES
// Security HTTP headers
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Data compression
app.use((0, compression_1.default)());
// Structured logging
app.use((0, pino_http_1.default)({
    logger: exports.logger,
    autoLogging: {
        ignore: (req) => req.url === '/api/health' || req.url === '/',
    },
}));
// 2. ROUTES
// Basic root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'Two Threads Studio Backend',
        version: '1.0.0',
    });
});
// API Routes (versioned)
app.use('/api/v1', routes_1.default);
// Swagger Documentation
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Two Threads Studio API',
        version: '1.0.0',
        description: 'API Documentation for Two Threads Studio Backend',
    },
    servers: [
        {
            url: `http://localhost:${env_1.env.PORT}/api/v1`,
            description: 'Development server',
        },
    ],
    paths: {
        '/health': {
            get: {
                summary: 'Check API Health',
                responses: {
                    '200': {
                        description: 'Successful response',
                    },
                },
            },
        },
    },
};
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// 3. UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 4. GLOBAL ERROR HANDLER
app.use(errorHandler_1.errorHandler);
exports.default = app;
