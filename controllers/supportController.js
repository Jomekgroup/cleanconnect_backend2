"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTicket = exports.getAllTickets = exports.getUserTickets = exports.createTicket = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const createTicket = async (req, res) => {
    const { category, subject, message } = req.body;
    const userId = req.user.id;
    try {
        const result = await db_1.default.query("INSERT INTO support_tickets (user_id, category, subject, message) VALUES ($1, $2, $3, $4) RETURNING *", [userId, category, subject, message]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create ticket" });
    }
};
exports.createTicket = createTicket;
const getUserTickets = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db_1.default.query("SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tickets" });
    }
};
exports.getUserTickets = getUserTickets;
const getAllTickets = async (req, res) => {
    try {
        const result = await db_1.default.query(`SELECT t.*, u.full_name as userName, u.role as userRole 
       FROM support_tickets t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.status = 'Open' DESC, t.created_at DESC`);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch all tickets" });
    }
};
exports.getAllTickets = getAllTickets;
const resolveTicket = async (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
    try {
        await db_1.default.query("UPDATE support_tickets SET status = 'Resolved', admin_response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [response, id]);
        res.json({ message: "Ticket resolved" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to resolve ticket" });
    }
};
exports.resolveTicket = resolveTicket;
//# sourceMappingURL=supportController.js.map