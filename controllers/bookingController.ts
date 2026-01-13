
import { Response } from 'express';
import pool from '../config/db';

export const createBooking = async (req: any, res: any) => {
  const { cleanerId, service, date, amount, totalAmount, paymentMethod } = req.body;
  const clientId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (client_id, cleaner_id, service, date, amount, total_amount, payment_method, payment_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        clientId, 
        cleanerId, 
        service, 
        date, 
        amount, 
        totalAmount || amount, 
        paymentMethod, 
        paymentMethod === 'Escrow' ? 'Pending Payment' : 'Not Applicable'
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getUserBookings = async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT b.*, u_cl.full_name as client_name, u_cn.full_name as cleaner_name 
       FROM bookings b
       LEFT JOIN users u_cl ON b.client_id = u_cl.id
       LEFT JOIN users u_cn ON b.cleaner_id = u_cn.id
       WHERE b.client_id = $1 OR b.cleaner_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const cancelBooking = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE bookings SET status = 'Cancelled' WHERE id = $1", [id]);
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const completeBooking = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    // If Escrow, move to Pending Payout
    const bookingCheck = await pool.query("SELECT payment_method FROM bookings WHERE id = $1", [id]);
    const method = bookingCheck.rows[0]?.payment_method;
    
    const paymentStatus = method === 'Escrow' ? 'Pending Payout' : 'Not Applicable';
    
    await pool.query(
      "UPDATE bookings SET status = 'Completed', job_approved_by_client = true, payment_status = $1 WHERE id = $2", 
      [paymentStatus, id]
    );
    res.json({ message: "Job marked as complete" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete job" });
  }
};
