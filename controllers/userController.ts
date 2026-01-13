
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { AuthRequest } from '../types';

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like user, status, and json.
export const getMe = async (req: any, res: any) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user?.id]);
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const bookingResult = await pool.query(
      'SELECT b.*, u_cl.full_name as client_name, u_cn.full_name as cleaner_name ' +
      'FROM bookings b ' +
      'LEFT JOIN users u_cl ON b.client_id = u_cl.id ' +
      'LEFT JOIN users u_cn ON b.cleaner_id = u_cn.id ' +
      'WHERE client_id = $1 OR cleaner_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    res.json({
      ...user,
      id: user.id.toString(),
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      services: user.services ? JSON.parse(user.services) : [],
      bookingHistory: bookingResult.rows.map((b: any) => ({
        ...b,
        clientName: b.client_name,
        cleanerName: b.cleaner_name
      })),
      isAdmin: user.is_admin,
      isVerified: user.is_verified,
      subscriptionTier: user.subscription_tier
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like body, status, and json.
export const updateProfile = async (req: any, res: any) => {
  const d = req.body;
  try {
    const result = await pool.query(`
      UPDATE users SET 
        full_name = COALESCE($1, full_name), 
        phone_number = COALESCE($2, phone_number), 
        state = COALESCE($3, state), 
        city = COALESCE($4, city), 
        other_city = COALESCE($5, other_city), 
        address = COALESCE($6, address), 
        government_id = COALESCE($7, government_id), 
        profile_photo = COALESCE($8, profile_photo), 
        experience = COALESCE($9, experience), 
        bio = COALESCE($10, bio), 
        charge_hourly = COALESCE($11, charge_hourly), 
        services = COALESCE($12, services), 
        bank_name = COALESCE($13, bank_name), 
        account_number = COALESCE($14, account_number), 
        cleaner_type = COALESCE($15, cleaner_type),
        gender = COALESCE($16, gender),
        role = COALESCE($18, role)
      WHERE id = $17 RETURNING *
    `, [
      d.fullName || null, d.phoneNumber || null, d.state || null, d.city || null, d.otherCity || null, 
      d.address || null, d.governmentId || null, d.profilePhoto || null, d.experience || 0, 
      d.bio || null, d.chargeHourly || null, d.services ? JSON.stringify(d.services) : null, 
      d.bankName || null, d.accountNumber || null, d.cleanerType || null, d.gender || null, req.user?.id, d.role || null
    ]);
    const updatedUser = result.rows[0];
    res.json({
      ...updatedUser,
      id: updatedUser.id.toString(),
      fullName: updatedUser.full_name,
      phoneNumber: updatedUser.phone_number,
      services: updatedUser.services ? JSON.parse(updatedUser.services) : []
    });
  } catch (error: any) { 
    res.status(500).json({ message: "Update failed" }); 
  }
};

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like body, status, and json.
export const changePassword = async (req: any, res: any) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user?.id]);
    const user = userResult.rows[0];
    
    if (user && (await bcrypt.compare(oldPassword, user.password_hash))) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user?.id]);
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Incorrect current password" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
