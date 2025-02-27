import { pool } from '../database/databaseServer.js';
import { StatusCodes } from 'http-status-codes';

export const getMessages = async (req, res) => {
  try {
    const { sender_name, receiver_name, last_message_id, page_size } = req.query;
    let query = `
      SELECT
        id,
        text,
        sender,
        receiver,
        created_at as timestamp
      FROM
        messages
      WHERE
        ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) )
    `;
    let params = [sender_name, receiver_name, receiver_name, sender_name];

    if (last_message_id) {
      query += ` AND id < ?`;
      params = [...params, last_message_id];
    }

    query += `
      ORDER BY id DESC
      LIMIT ?
    `;
    params = [...params, page_size];

    const [messages] = await pool.execute(query, params);

    res.json({ messages });
  } catch (err) {
    console.error('数据库错误:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '查询失败' });
  }
};
