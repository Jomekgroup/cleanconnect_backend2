"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSubscription = exports.approveSubscription = exports.createAdmin = exports.deleteUser = exports.getAllUsers = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const getAllUsers = async (req, res) => {
    try {
        // Admins need booking history for verification
        const usersResult = await db_1.default.query("SELECT * FROM users ORDER BY created_at DESC");
        const bookingsResult = await db_1.default.query("SELECT * FROM bookings");
        const users = usersResult.rows.map(u => ({
            ...u,
            id: u.id.toString(),
            fullName: u.full_name,
            phoneNumber: u.phone_number,
            isAdmin: u.is_admin,
            adminRole: u.admin_role,
            isVerified: u.is_verified,
            subscriptionTier: u.subscription_tier,
            bookingHistory: bookingsResult.rows.filter(b => b.client_id === u.id || b.cleaner_id === u.id)
        }));
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.query("DELETE FROM users WHERE id = $1", [id]);
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
const createAdmin = async (req, res) => {
    const { email, fullName, adminRole } = req.body;
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash('adminPassword123', salt);
        await db_1.default.query("INSERT INTO users (email, password_hash, full_name, role, is_admin, admin_role, is_verified) VALUES ($1, $2, $3, 'client', true, $4, true)", [email.toLowerCase().trim(), hash, fullName, adminRole]);
        res.status(201).json({ message: "Staff account created" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create staff account" });
    }
};
exports.createAdmin = createAdmin;
const approveSubscription = async (req, res) => {
    const { id } = req.params; // User ID
    try {
        const userCheck = await db_1.default.query("SELECT pending_subscription FROM users WHERE id = $1", [id]);
        const newTier = userCheck.rows[0]?.pending_subscription || 'Standard';
        await db_1.default.query("UPDATE users SET subscription_tier = $1, pending_subscription = NULL, subscription_receipt = NULL WHERE id = $2", [newTier, id]);
        res.json({ message: `Subscription approved: ${newTier}` });
    }
    catch (error) {
        res.status(500).json({ message: "Approval failed" });
    }
};
exports.approveSubscription = approveSubscription;
const requestSubscription = async (req, res) => {
    const { plan } = req.body;
    const userId = req.user.id;
    try {
        await db_1.default.query("UPDATE users SET pending_subscription = $1 WHERE id = $2", [plan, userId]);
        res.json({ message: "Upgrade requested" });
    }
    catch (error) {
        res.status(500).json({ message: "Request failed" });
    }
};
exports.requestSubscription = requestSubscription;
//# sourceMappingURL=adminController.js.map