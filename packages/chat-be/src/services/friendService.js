import { pool } from '../database/databaseServer.js';
import { StatusCodes } from 'http-status-codes';

export const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    /** 查询好友列表，并获取每个好友的最后一条消息 */
    const [friends] = await pool.query(
      `
      WITH RankedMessages AS (
        SELECT 
          m.*,
          ROW_NUMBER() OVER (
            PARTITION BY 
              CASE 
                WHEN m.sender = u.username THEN m.receiver 
                ELSE m.sender 
              END
            ORDER BY m.created_at DESC
          ) as rn
        FROM users u
        LEFT JOIN messages m ON (m.sender = u.username OR m.receiver = u.username)
        WHERE u.id = ?
      )
      SELECT 
        u.id,
        u.username,
        u.avatar,
        m.text as lastMessage,
        m.created_at as lastMessageTime
      FROM friendships fs 
      JOIN users u ON 
      (
        (fs.user_id_1 = ? AND fs.user_id_2 = u.id) OR
        (fs.user_id_2 = ? AND fs.user_id_1 = u.id)
      )
      LEFT JOIN RankedMessages m ON rn = 1 
      AND (
        (m.sender = u.username) OR 
        (m.receiver = u.username)
      )
      WHERE fs.status = 'accepted' AND u.id != ?
      ORDER BY COALESCE(m.created_at, '1970-01-01') DESC
      `,
      [userId, userId, userId, userId]
    );

    res.json({ friends });
  } catch (err) {
    console.error('数据库查询出错:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '服务器内部错误' });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    /**查询所有发给当前用户的好友请求 */
    const [AllFriendRequests] = await pool.query(
      `
      SELECT 
        fs.id,
        u.username,
        u.avatar,
        fs.status
      FROM friendships fs JOIN users u ON 
      (
        (fs.user_id_1 = ? AND fs.user_id_2 = u.id) OR
        (fs.user_id_2 = ? AND fs.user_id_1 = u.id)
      )
      WHERE fs.last_sender_id != ?
    `,
      [userId, userId, userId]
    );

    res.json({ AllFriendRequests });
  } catch (err) {
    console.error('数据库查询出错:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '服务器内部错误' });
  }
};

export const sendFriendRequests = async (req, res) => {
  try {
    const senderUserId = req.params.userId;
    const { receiverUsername } = req.body;

    /** 1. 查找接收者用户是否存在 */
    const [receiverUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [receiverUsername]);

    if (receiverUsers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: '用户名不存在' });
    }
    const receiverUser = receiverUsers[0];
    const receiverUserId = receiverUser.id;

    if (Number(senderUserId) === receiverUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: '不能向自己发送好友请求' });
    }

    /** 2. 检查是否已存在好友关系或待处理的请求 */
    const [existingRequests] = await pool.execute(
      `
      SELECT * 
      FROM friendships
      WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)
      `,
      [
        Math.min(senderUserId, receiverUserId),
        Math.max(senderUserId, receiverUserId),
        Math.min(receiverUserId, senderUserId),
        Math.max(receiverUserId, senderUserId),
      ] /** 保证id对大小关系 */
    );

    if (existingRequests.length > 0) {
      const existingRequest = existingRequests[0];
      let message = '';
      if (existingRequest.status === 'accepted') {
        message = '你们已经是好友，无需重复添加';
      } else if (existingRequest.status === 'rejected') {
        message = '好友请求已被拒绝，无法再添加对方';
      } else if (existingRequest.status === 'pending') {
        message = '好友请求待处理中';
      }

      return res.status(StatusCodes.CONFLICT).json({ message: message }); // 409 Conflict
    }

    /** 3. 创建新的好友请求 */
    const [result] = await pool.execute(
      'INSERT INTO friendships (user_id_1, user_id_2, status, last_sender_id) VALUES (?, ?, ?, ?)',
      [Math.min(senderUserId, receiverUserId), Math.max(senderUserId, receiverUserId), 'pending', senderUserId]
    );

    const requestId = result.insertId;

    /** 4. 返回成功响应 */
    res.status(StatusCodes.CREATED).json({
      message: '好友请求已发送',
      requestId: requestId,
      receiverUser: { id: receiverUserId, username: receiverUsername, avatar: receiverUser.avatar },
    });
  } catch (err) {
    console.error('发送好友请求出错:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
};

export const updateFriendRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { newStatus } = req.body;

    /** 查询好友请求是否存在 */
    const [existingRequests] = await pool.execute('SELECT * FROM friendships WHERE id = ?', [requestId]);
    if (existingRequests.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: '好友请求不存在' });
    }

    /** 更新数据库 friends 表的 status 字段 */
    const [result] = await pool.execute('UPDATE friendships SET status = ? WHERE id = ?', [newStatus, requestId]);

    res.status(StatusCodes.OK).json({ message: '好友请求状态更新成功', requestId: requestId, newStatus: newStatus });
  } catch (error) {
    console.error('更新好友请求状态出错:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
};
