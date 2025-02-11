import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';

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

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: '用户名已被占用' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    const [result] = await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
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

app.listen(port, () => {
  console.log(`后端服务成功在 ${port} 端口启动`);
});
