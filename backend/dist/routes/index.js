"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
// Define API v1 routes here
router.get('/health', health_controller_1.checkHealth);
exports.default = router;
