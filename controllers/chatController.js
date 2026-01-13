"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChatMessages = exports.getChats = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const getChats = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db_1.default.query(`SELECT c.*, 
       (SELECT json_build_object('id', m.id, 'text', m.text, 'senderId', m.sender_id, 'timestamp', m.timestamp) 
        FROM messages m WHERE m.chat_id = c.id ORDER BY m.timestamp DESC LIMIT 1) as lastMessage,
       (SELECT json_object_agg(u.id, u.full_name) FROM users u WHERE u.id = ANY(c.participants)) as participantNames
       FROM chats c
       WHERE $1 = ANY(c.participants)
       ORDER BY c.updated_at DESC`, [userId]);
        res.json(result.rows.map(row => ({
            ...row,
            participantNames: row.participantnames,
            lastMessage: row.lastmessage
        })));
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch chats" });
    }
};
exports.getChats = getChats;
const getChatMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await db_1.default.query("SELECT m.id, m.chat_id as chatId, m.sender_id as senderId, m.text, m.timestamp FROM messages m WHERE chat_id = $1 ORDER BY timestamp ASC", [chatId]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
exports.getChatMessages = getChatMessages;
const sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;
    try {
        const result = await db_1.default.query("INSERT INTO messages (chat_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *", [chatId, senderId, text]);
        await db_1.default.query("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [chatId]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send message" });
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=chatController.js.map