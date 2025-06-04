"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
// rateLimit.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redisClient_1 = __importDefault(require("./redisClient"));
exports.limiter = (0, express_rate_limit_1.default)({
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redisClient_1.default.sendCommand(args),
    }),
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: "Too many requests from this IP, please try again after a minute.",
});
