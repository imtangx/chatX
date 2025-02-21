import { pool } from '../database/databaseServer.js';
import * as authUtils from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      res.status(StatusCodes.CONFLICT).json({ message: '用户名已被占用' });
    }

    const hashedPassword = await authUtils.hashPassword(password);

    const defaultAvatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${username}`;
    const [result] = await pool.execute('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)', [
      username,
      hashedPassword,
      defaultAvatar,
    ]);

    const userId = result.insertId;

    const token = authUtils.genToken({ username, userId });

    // 注册成功，返回用户信息和 JWT
    res.status(StatusCodes.CREATED).json({
      message: '注册成功',
      user: {
        userId, 
        username,
        avatar: defaultAvatar,
      },
      token,
    });
  } catch (err) {
    console.error('用户注册出错：', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: '用户名不存在' });
    }

    // 验证密码
    const user = existingUsers[0];
    const isPasswordValid = await authUtils.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: '密码错误' });
    }

    const token = authUtils.genToken({ userId: user.id, username: user.username });
    const refreshToken = authUtils.genRefreshToken({ userId: user.id, username: user.username });

    // 登录成功，返回用户信息和 JWT
    res.status(StatusCodes.OK).json({
      message: '登录成功',
      user: {
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
      },
      token,
      refreshToken,
    });
  } catch (err) {
    console.error('登录验证出错：', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const decoded = authUtils.verifyToken(refreshToken);

    const newToken = authUtils.genToken({ userId: decoded.userId, username: decoded.username });

    res.json({ token: newToken });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token 已失效，请重新登录' });
  }
};
