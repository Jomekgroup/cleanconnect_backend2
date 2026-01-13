"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';
const protect = async (req, res, next) => {
    let token;
    // Use type casting to access headers safely, handling potential type mismatches
    const authHeader = req.headers?.authorization;
    if (authHeader &&
        typeof authHeader === 'string' &&
        authHeader.startsWith('Bearer')) {
        try {
            // Get token from header
            token = authHeader.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // Attach user info to request (id, role, isAdmin, adminRole)
            // Note: We avoid fetching the full user from DB here for performance on every request,
            // relying on the data embedded in the token. If critical status (like isSuspended)
            // changes frequently, consider fetching from DB here.
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map