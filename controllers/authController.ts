
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { generateToken } from '../utils/token';
import { sendEmail } from '../utils/email';

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like body, status, and json.
export const register = async (req: any, res: any): Promise<any> => {
  const { email, password, role, address } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [email.toLowerCase().trim(), hashedPassword, role || 'client', address || '']
    );
    const newUser = result.rows[0];

    res.status(201).json({
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        role: newUser.role,
        isAdmin: newUser.is_admin,
        subscriptionTier: newUser.subscription_tier,
        address: newUser.address
      },
      token: generateToken(newUser.id, newUser.role, newUser.is_admin)
    });
  } catch (error: any) {
    if (error.code === '23505') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like body, status, and json.
export const login = async (req: any, res: any): Promise<any> => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        token: generateToken(user.id, user.role, user.is_admin, user.admin_role),
        user: {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          fullName: user.full_name,
          isAdmin: user.is_admin,
          adminRole: user.admin_role,
          subscriptionTier: user.subscription_tier,
          state: user.state,
          city: user.city,
          address: user.address,
          phoneNumber: user.phone_number,
          isVerified: user.is_verified
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Login service unavailable' });
  }
};

// Added 'any' type to req and res to resolve compilation errors regarding missing properties like body, status, and json.
export const forgotPassword = async (req: any, res: any) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = result.rows[0];

    if (user) {
      // In a real app, generate a single-use JWT with short expiry
      const recoveryLink = `https://cleanconnect.ng/reset-password?token=${Math.random().toString(36).substring(7)}`;
      await sendEmail({
        to: email,
        subject: 'Password Recovery - CleanConnect',
        text: `Hello, you requested a password reset. Click here to reset: ${recoveryLink}`,
        html: `<p>Hello, you requested a password reset. <a href="${recoveryLink}">Click here to reset your password.</a></p>`
      });
    }
    
    // Always return success to prevent email discovery
    res.json({ message: 'If an account exists with that email, a recovery link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Recovery request failed' });
  }
};
