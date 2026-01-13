
import { Response } from 'express';
import pool from '../config/db';

export const getChats = async (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.*, 
       (SELECT json_build_object('id', m.id, 'text', m.text, 'senderId', m.sender_id, 'timestamp', m.timestamp) 
        FROM messages m WHERE m.chat_id = c.id ORDER BY m.timestamp DESC LIMIT 1) as lastMessage,
       (SELECT json_object_agg(u.id, u.full_name) FROM users u WHERE u.id = ANY(c.participants)) as participantNames
       FROM chats c
       WHERE $1 = ANY(c.participants)
       ORDER BY c.updated_at DESC`,
      [userId]
    );
    res.json(result.rows.map(row => ({
        ...row,
        participantNames: row.participantnames,
        lastMessage: row.lastmessage
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const getChatMessages = async (req: any, res: any) => {
  const { chatId } = req.params;
  try {
    const result = await pool.query(
      "SELECT m.id, m.chat_id as chatId, m.sender_id as senderId, m.text, m.timestamp FROM messages m WHERE chat_id = $1 ORDER BY timestamp ASC",
      [chatId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req: any, res: any) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const senderId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO messages (chat_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *",
      [chatId, senderId, text]
    );
    await pool.query("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [chatId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
