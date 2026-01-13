"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';
/**
 * Generates a JSON Web Token for authenticated users.
 * @param id - User ID
 * @param role - User Role (client/cleaner)
 * @param isAdmin - Boolean flag for admin status
 * @param adminRole - Specific admin role (Super, Support, etc.)
 * @returns Signed JWT string
 */
const generateToken = (id, role, isAdmin, adminRole) => {
    const payload = { id, role, isAdmin, adminRole };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};
exports.generateToken = generateToken;
/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT string to verify
 * @returns Decoded payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token.js.map