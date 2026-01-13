
import { Response } from 'express';
import pool from '../config/db';

export const submitReview = async (req: any, res: any) => {
  const { bookingId, cleanerId, rating, timeliness, thoroughness, conduct, comment } = req.body;
  const clientId = req.user.id;

  try {
    // 1. Insert review
    await pool.query(
      `INSERT INTO reviews (booking_id, cleaner_id, client_id, rating, timeliness, thoroughness, conduct, comment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [bookingId, cleanerId, clientId, rating, timeliness, thoroughness, conduct, comment]
    );

    // 2. Update booking status
    await pool.query("UPDATE bookings SET status = 'Completed' WHERE id = $1", [bookingId]);

    // 3. Recalculate cleaner rating
    const statsResult = await pool.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE cleaner_id = $1",
      [cleanerId]
    );
    const { avg_rating, count } = statsResult.rows[0];

    await pool.query(
      "UPDATE users SET rating = $1, reviews = $2 WHERE id = $3",
      [avg_rating, count, cleanerId]
    );

    res.json({ message: "Review submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const getCleanerReviews = async (req: any, res: any) => {
  const { cleanerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, u.full_name as reviewer_name 
       FROM reviews r
       LEFT JOIN users u ON r.client_id = u.id
       WHERE r.cleaner_id = $1
       ORDER BY r.created_at DESC`,
      [cleanerId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
