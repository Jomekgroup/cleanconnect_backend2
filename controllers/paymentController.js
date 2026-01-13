"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsPaid = exports.confirmPayment = exports.uploadReceipt = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const uploadReceipt = async (req, res) => {
    const { id } = req.params; // Booking ID
    const { dataUrl } = req.body; // Base64 receipt
    try {
        await db_1.default.query("UPDATE bookings SET payment_receipt = $1, payment_status = 'Pending Admin Confirmation' WHERE id = $2", [dataUrl, id]);
        res.json({ message: "Receipt uploaded successfully. Awaiting verification." });
    }
    catch (error) {
        res.status(500).json({ message: "Upload failed" });
    }
};
exports.uploadReceipt = uploadReceipt;
const confirmPayment = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.query("UPDATE bookings SET payment_status = 'Confirmed' WHERE id = $1", [id]);
        res.json({ message: "Payment verified and confirmed" });
    }
    catch (error) {
        res.status(500).json({ message: "Confirmation failed" });
    }
};
exports.confirmPayment = confirmPayment;
const markAsPaid = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.query("UPDATE bookings SET payment_status = 'Paid' WHERE id = $1", [id]);
        res.json({ message: "Payout released to cleaner" });
    }
    catch (error) {
        res.status(500).json({ message: "Payout update failed" });
    }
};
exports.markAsPaid = markAsPaid;
//# sourceMappingURL=paymentController.js.map