
import { Response } from 'express';
import pool from '../config/db';

export const createTicket = async (req: any, res: any) => {
  const { category, subject, message } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO support_tickets (user_id, category, subject, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, category, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

export const getUserTickets = async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getAllTickets = async (req: any, res: any) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.full_name as userName, u.role as userRole 
       FROM support_tickets t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.status = 'Open' DESC, t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all tickets" });
  }
};

export const resolveTicket = async (req: any, res: any) => {
  const { id } = req.params;
  const { response } = req.body;
  try {
    await pool.query(
      "UPDATE support_tickets SET status = 'Resolved', admin_response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [response, id]
    );
    res.json({ message: "Ticket resolved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve ticket" });
  }
};
