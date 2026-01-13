import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') ? { rejectUnauthorized: false } : false,
});

/**
 * Initializes the database schema.
 * Note: Seeding is omitted in production to ensure a clean state.
 */
export const initDB = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        full_name VARCHAR(255),
        phone_number VARCHAR(20),
        gender VARCHAR(20),
        state VARCHAR(100),
        city VARCHAR(100),
        other_city VARCHAR(100),
        address TEXT,
        government_id TEXT,
        profile_photo TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        admin_role VARCHAR(50),
        is_suspended BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        cleaner_type VARCHAR(50) DEFAULT 'Individual',
        experience INTEGER DEFAULT 0,
        services TEXT,
        bio TEXT,
        charge_hourly INTEGER,
        charge_daily INTEGER,
        charge_per_contract INTEGER,
        bank_name VARCHAR(100),
        account_number VARCHAR(20),
        rating DECIMAL(3,2) DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        subscription_tier VARCHAR(50) DEFAULT 'Free',
        pending_subscription VARCHAR(50),
        subscription_receipt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        total_amount INTEGER,
        status VARCHAR(50) DEFAULT 'Upcoming',
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(100) DEFAULT 'Pending Payment',
        payment_receipt TEXT,
        job_approved_by_client BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        cleaner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating DECIMAL(3,2),
        timeliness INTEGER,
        thoroughness INTEGER,
        conduct INTEGER,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS support_tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Open',
        admin_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        participants INTEGER[] NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database schema synchronized successfully for production.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
};

export default pool;