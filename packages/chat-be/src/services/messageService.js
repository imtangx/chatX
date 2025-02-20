import { pool } from '../database/databaseServer.js';
import { StatusCodes } from 'http-status-codes';

export const getMessages = async (req, res) => {
  try {
    const { sender_name, receiver_name } = req.query;
    const [messages] = await pool.execute(
      'SELECT id, text, sender, receiver, created_at as timestamp FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY created_at ASC',
      [sender_name, receiver_name, receiver_name, sender_name]
    );
    res.json({ messages });
  } catch (err) {
    console.error('数据库错误:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '查询失败' });
  }
};
