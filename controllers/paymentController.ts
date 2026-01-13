
import { Response } from 'express';
import pool from '../config/db';

export const uploadReceipt = async (req: any, res: any) => {
  const { id } = req.params; // Booking ID
  const { dataUrl } = req.body; // Base64 receipt

  try {
    await pool.query(
      "UPDATE bookings SET payment_receipt = $1, payment_status = 'Pending Admin Confirmation' WHERE id = $2",
      [dataUrl, id]
    );
    res.json({ message: "Receipt uploaded successfully. Awaiting verification." });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const confirmPayment = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE bookings SET payment_status = 'Confirmed' WHERE id = $1", [id]);
    res.json({ message: "Payment verified and confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Confirmation failed" });
  }
};

export const markAsPaid = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE bookings SET payment_status = 'Paid' WHERE id = $1", [id]);
    res.json({ message: "Payout released to cleaner" });
  } catch (error) {
    res.status(500).json({ message: "Payout update failed" });
  }
};
