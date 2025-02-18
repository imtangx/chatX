import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'chat_app_db',
});

const secretKey = 'imtxcangetoffer';

const wss = new WebSocketServer({ noServer: true });
const connections = new Map();

wss.on('connection', (ws, req) => {
  const urlParams = new URL(req.url, 'http://localhost:3001').searchParams;
  const username = urlParams.get('username');

  if (username) {
    connections.set(username, ws);
    console.log(`用户${username}连接成功`);
  }

  ws.on('message', async message => {
    try {
      const messageData = JSON.parse(message);
      console.log(`收到${username}发来的消息：`, messageData);
      
      // 存储消息到数据库
      const { text, sender, receiver } = messageData;
      const [result] = await pool.execute(
        'INSERT INTO messages (text, sender, receiver) VALUES (?, ?, ?)',
        [text, sender, receiver]
      );
      
      // 获取刚插入的消息ID
      const messageId = result.insertId;
      
      // 构造要发送的消息对象
      const messageToSend = {
        id: messageId,
        text,
        sender,
        receiver,
        timestamp: new Date().toISOString()
      };

      // 发送给接收者
      const receiverWs = connections.get(receiver);
      if (receiverWs) {
        receiverWs.send(JSON.stringify(messageToSend));
      }

      // 发送给发送者（这是之前缺少的部分）
      const senderWs = connections.get(sender);
      if (senderWs) {
        senderWs.send(JSON.stringify(messageToSend));
      }
      
    } catch (error) {
      console.error('处理消息时出错:', error);
    }
  });

  ws.on('close', () => {
    if (connections.has(username)) {
      connections.delete(username);
      console.log(`用户 ${username} 断开连接`);
    }
  });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: '用户名已被占用' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    const defaultAvatarUrl = `https://api.dicebear.com/7.x/miniavs/svg?seed=${username}`;
    const [result] = await pool.execute('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)', [
      username,
      hashedPassword,
      defaultAvatarUrl,
    ]);

    const userId = result.insertId; // 获取新插入用户的 ID

    // 生成 JWT
    const token = jwt.sign({ userId: userId, username: username }, secretKey, {
      expiresIn: '1h',
    });

    // 注册成功，返回用户信息和 JWT
    res.status(StatusCodes.CREATED).json({
      message: '注册成功',
      user: {
        id: userId,
        username: username,
        avatar: defaultAvatarUrl,
      },
      token,
    });
  } catch (err) {
    console.error('用户注册出错：', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: '用户名不存在' });
    }

    // 验证密码
    const user = existingUsers[0];

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: '密码错误' });
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, {
      expiresIn: '1h',
    });

    // 登录成功，返回用户信息和 JWT
    res.status(StatusCodes.OK).json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error('登录验证出错：', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
});

app.get('/friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    /** 查询此用户所有accepted状态的friendships */
    const [friends] = await pool.query(
      `
      SELECT 
        u.id,
        u.username,
        u.avatar
      FROM friendships fs JOIN users u ON 
      (
        (fs.user_id_1 = ? AND fs.user_id_2 = u.id) OR
        (fs.user_id_2 = ? AND fs.user_id_1 = u.id)
      )
      WHERE fs.status = 'accepted' AND u.id != ?
      `,
      [userId, userId, userId]
    );

    res.json({ friends });
  } catch (err) {
    console.error('数据库错误:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

app.post('/friends/requests/:userId', async (req, res) => {
  try {
    const senderUserId = req.params.userId;
    const { receiverUsername } = req.body;

    // **1. 查找接收者用户是否存在**
    const [receiverUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [receiverUsername]);

    if (receiverUsers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: '此用户不存在' }); // 404 Not Found
    }
    const receiverUser = receiverUsers[0];
    const receiverUserId = receiverUser.id;

    if (Number(senderUserId) === receiverUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: '不能向自己发送好友请求' });
    }

    // **2. 检查是否已存在好友关系或待处理的请求**
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

    // **3. 创建新的好友请求**
    const [result] = await pool.execute(
      'INSERT INTO friendships (user_id_1, user_id_2, status, last_sender_id) VALUES (?, ?, ?, ?)',
      [Math.min(senderUserId, receiverUserId), Math.max(senderUserId, receiverUserId), 'pending', senderUserId]
    );

    const requestId = result.insertId;

    // **4. 返回成功响应**
    res.status(StatusCodes.CREATED).json({
      message: '好友请求已发送',
      requestId: requestId,
      receiverUser: { id: receiverUserId, username: receiverUsername, avatar: receiverUser.avatar },
    }); // 201 Created
  } catch (err) {
    console.error('发送好友请求出错:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
});

app.get('/friends/requests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // 查询所有发给当前用户的请求
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
    console.error('数据库错误:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

app.patch('/friends/requests/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { newStatus } = req.body;

    // 查询好友请求是否存在
    const [existingRequests] = await pool.execute('SELECT * FROM friendships WHERE id = ?', [requestId]);
    if (existingRequests.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: '好友请求不存在' });
    }

    // 更新数据库 friends 表的 status 字段
    const [result] = await pool.execute('UPDATE friendships SET status = ? WHERE id = ?', [newStatus, requestId]);

    res.status(StatusCodes.OK).json({ message: '好友请求状态更新成功', requestId: requestId, newStatus: newStatus });
  } catch (error) {
    console.error('更新好友请求状态出错:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
});

app.get('/messages', async (req, res) => {
  try {
    const { sender_name, receiver_name } = req.query;
    const [messages] = await pool.execute(
      'SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)',
      [sender_name, receiver_name, receiver_name, sender_name]
    );
    res.json({ messages });
  } catch (err) {
    console.error('数据库错误:', err);
    res.status(500).json({ error: '查询失败' });
  }
});

const server = app.listen(port, () => {
  console.log(`后端服务成功在 ${port} 端口启动`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
