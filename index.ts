
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route Imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import serviceRoutes from './routes/serviceRoutes';
import chatRoutes from './routes/chatRoutes';
import supportRoutes from './routes/supportRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';

import pool from './config/db';
import { aiSearchCleaners } from './utils/aiSearch';
import { protect } from './middleware/authMiddleware';
import * as adminController from './controllers/adminController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }) as any);
app.use(cors() as any);

// Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes); // Deprecated in favor of admin/bookings but kept for backward compatibility if needed
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Shared/Global Endpoints
app.post('/api/subscriptions/request', protect as any, adminController.requestSubscription as any);
app.post('/api/subscriptions/receipt', protect as any, async (req: any, res: any) => {
    const { dataUrl } = req.body;
    try {
        await pool.query("UPDATE users SET subscription_receipt = $1 WHERE id = $2", [dataUrl, req.user.id]);
        res.json({ message: "Subscription receipt uploaded." });
    } catch (e) {
        res.status(500).json({ message: "Upload failed" });
    }
});

app.get('/api/cleaners', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users 
      WHERE role = 'cleaner' AND is_suspended = false 
      ORDER BY subscription_tier = 'Premium' DESC, subscription_tier = 'Pro' DESC, rating DESC
    `);
    res.json(result.rows.map(c => ({
      id: c.id.toString(),
      name: c.full_name,
      photoUrl: c.profile_photo || 'https://via.placeholder.com/400x300?text=Profile',
      rating: parseFloat(c.rating) || 5.0,
      reviews: parseInt(c.reviews) || 0,
      serviceTypes: c.services ? JSON.parse(c.services) : [],
      state: c.state,
      city: c.city,
      bio: c.bio,
      chargeHourly: c.charge_hourly,
      subscriptionTier: c.subscription_tier,
      isVerified: c.is_verified
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to load cleaners" });
  }
});

app.post('/api/ai/search', async (req, res) => {
    const { query } = req.body;
    const matchingIds = await aiSearchCleaners(query);
    res.json({ matchingIds });
});

// Final Error Handlers
app.use(notFound as any);
app.use(errorHandler as any);

// Start Server
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => console.log(`🚀 CleanConnect Server 100% Operational on port ${PORT}`));
  } catch (error) {
    console.error("Critical server failure:", error);
    process.exit(1);
  }
};

startServer();
