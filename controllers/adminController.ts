
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';

export const getAllUsers = async (req: any, res: any) => {
  try {
    // Admins need booking history for verification
    const usersResult = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    const bookingsResult = await pool.query("SELECT * FROM bookings");

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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const createAdmin = async (req: any, res: any) => {
  const { email, fullName, adminRole } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('adminPassword123', salt);
    
    await pool.query(
      "INSERT INTO users (email, password_hash, full_name, role, is_admin, admin_role, is_verified) VALUES ($1, $2, $3, 'client', true, $4, true)",
      [email.toLowerCase().trim(), hash, fullName, adminRole]
    );
    res.status(201).json({ message: "Staff account created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create staff account" });
  }
};

export const approveSubscription = async (req: any, res: any) => {
    const { id } = req.params; // User ID
    try {
        const userCheck = await pool.query("SELECT pending_subscription FROM users WHERE id = $1", [id]);
        const newTier = userCheck.rows[0]?.pending_subscription || 'Standard';

        await pool.query(
            "UPDATE users SET subscription_tier = $1, pending_subscription = NULL, subscription_receipt = NULL WHERE id = $2",
            [newTier, id]
        );
        res.json({ message: `Subscription approved: ${newTier}` });
    } catch (error) {
        res.status(500).json({ message: "Approval failed" });
    }
};

export const requestSubscription = async (req: any, res: any) => {
    const { plan } = req.body;
    const userId = req.user.id;
    try {
        await pool.query("UPDATE users SET pending_subscription = $1 WHERE id = $2", [plan, userId]);
        res.json({ message: "Upgrade requested" });
    } catch (error) {
        res.status(500).json({ message: "Request failed" });
    }
};
