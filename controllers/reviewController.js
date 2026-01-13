"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCleanerReviews = exports.submitReview = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const submitReview = async (req, res) => {
    const { bookingId, cleanerId, rating, timeliness, thoroughness, conduct, comment } = req.body;
    const clientId = req.user.id;
    try {
        // 1. Insert review
        await db_1.default.query(`INSERT INTO reviews (booking_id, cleaner_id, client_id, rating, timeliness, thoroughness, conduct, comment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [bookingId, cleanerId, clientId, rating, timeliness, thoroughness, conduct, comment]);
        // 2. Update booking status
        await db_1.default.query("UPDATE bookings SET status = 'Completed' WHERE id = $1", [bookingId]);
        // 3. Recalculate cleaner rating
        const statsResult = await db_1.default.query("SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE cleaner_id = $1", [cleanerId]);
        const { avg_rating, count } = statsResult.rows[0];
        await db_1.default.query("UPDATE users SET rating = $1, reviews = $2 WHERE id = $3", [avg_rating, count, cleanerId]);
        res.json({ message: "Review submitted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to submit review" });
    }
};
exports.submitReview = submitReview;
const getCleanerReviews = async (req, res) => {
    const { cleanerId } = req.params;
    try {
        const result = await db_1.default.query(`SELECT r.*, u.full_name as reviewer_name 
       FROM reviews r
       LEFT JOIN users u ON r.client_id = u.id
       WHERE r.cleaner_id = $1
       ORDER BY r.created_at DESC`, [cleanerId]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};
exports.getCleanerReviews = getCleanerReviews;
//# sourceMappingURL=reviewController.js.map