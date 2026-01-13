"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const express_1 = require("express");
// Handle 404 - Not Found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
// Global Error Handler
const errorHandler = (err, req, res, next) => {
    // If status code is 200 (OK) but there is an error, default to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Only show stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map