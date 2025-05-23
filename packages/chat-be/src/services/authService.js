import { pool } from '../database/databaseServer.js';
import * as authUtils from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';
import { EmailLogin } from '../thirdPartyAuth/email/index.js';
import { GithubLogin } from '../thirdPartyAuth/github/index.js';
import { GoogleLogin } from '../thirdPartyAuth/google/index.js';
import { GITHUB_SCOPES } from '../thirdPartyAuth/github/constant.js';
import { GOOGLE_SCOPES } from '../thirdPartyAuth/google/constant.js';
import axios from 'axios';
import e from 'express';
import path from 'path';

const FE_URL = process.env.FE_URL;

const emailLogin = new EmailLogin({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  user: process.env.EMAIL_USER,
  authCode: process.env.EMAIL_AUTH_CODE,
  from: process.env.EMAIL_FROM,
});

const githubLogin = new GithubLogin({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL,
  scope: [...GITHUB_SCOPES.MINIMAL],
});

const googleLogin = new GoogleLogin({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  scope: [...GOOGLE_SCOPES.MINIMAL],
});

export const toGithub = async (req, res) => {
  const url = githubLogin.getAuthUrl();
  console.log('回调地址', url);
  res.redirect(url);
};

export const toGoogle = async (req, res) => {
  const url = googleLogin.getAuthUrl();
  console.log('回调地址', url);
  res.redirect(url);
};

export const callbackGithub = async (req, res) => {
  const { code: authCode } = req.query;
  if (!authCode || typeof authCode !== 'string') {
    res.status(400).json({ error: 'Invalid authCode' });
  }

  try {
    const response = await githubLogin.handleCallback(authCode);
    const { id: oauth_id, avatar_url: avatar, login } = response.data.userInfo;

    /**
     *  检查有没有github账号存在
     *  如果有 直接登录
     *  如果没有 新建一个账户 要考虑用户名的唯一性
     */
    const [existingGithubs] = await pool.execute('SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?', [
      oauth_id,
      'github',
    ]);
    
    
    /**
     * 存在github账号 直接登录
    */
   if (existingGithubs.length > 0) {
     const user = existingGithubs[0];
     const token = authUtils.genToken({ userId: user.id, username: user.username });
     const refreshToken = authUtils.genRefreshToken({ userId: user.id, username: user.username });
 
     res.cookie('refreshToken', refreshToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       path: '/auth/refresh',
       // maxAge: 24 * 60 * 60 * 1000, // 24小时
     });
     
      // 修改返回逻辑，不直接返回JSON，而是重定向到前端
      const queryParams = new URLSearchParams({
        userId: user.id.toString(),
        username: user.username,
        avatar: user.avatar,
        token,
        // refreshToken,
        provider: 'github',
      }).toString();

      // 重定向到前端的处理路由
      res.redirect(`${FE_URL}/auth/callback?${queryParams}`);

      return;
    }

    /**
     * 生成唯一用户名
     */
    // let username = login;
    let username = await authUtils.genUniqueName(login);
    let password = await authUtils.hashPassword(oauth_id);

    const [result] = await pool.execute(
      'INSERT INTO users (username, password, avatar, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)',
      [username, password, avatar, 'github', oauth_id]
    );

    const userId = result.insertId;
    const token = authUtils.genToken({ username, userId });
    const refreshToken = authUtils.genRefreshToken({ username, userId });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      // maxAge: 24 * 60 * 60 * 1000, // 24小时
    });

    // 修改返回逻辑，不直接返回JSON，而是重定向到前端
    const queryParams = new URLSearchParams({
      userId: userId.toString(),
      username,
      avatar,
      token,
      // refreshToken,
      provider: 'github',
    }).toString();

    // 重定向到前端的处理路由
    res.redirect(`${FE_URL}/auth/callback?${queryParams}`);
  } catch (error) {
    console.error(error);
    res.redirect(`${FE_URL}/auth/callback?error=登录失败`);
  }
};

/** 重定向到前端处理哈希 */
export const tempGoogle = async (req, res) => {
  res.redirect(`${FE_URL}/auth/login`);
};

/** 拿到前端通过哈希解析出来的数据 拿到数据 模仿 github回调登录 */
export const callbackGoogle = async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get(
      `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const oauth_id = response.data.resourceName;
    const { displayName } = response.data.names[0];
    const avatar = response.data.photos[0].url;

    /**
     * 检查有没有google账号存在
     * 如果有 直接登录
     * 如果没有 新建一个账户
     */
    const [existingGithubs] = await pool.execute('SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?', [
      oauth_id,
      'google',
    ]);

    /**
     * 存在google账号 直接登录
     */
    if (existingGithubs.length > 0) {
      const user = existingGithubs[0];
      const token = authUtils.genToken({ userId: user.id, username: user.username });
      const refreshToken = authUtils.genRefreshToken({ userId: user.id, username: user.username });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        // maxAge: 24 * 60 * 60 * 1000, // 24小时
      });

      const queryParams = new URLSearchParams({
        userId: user.id.toString(),
        username: user.username,
        avatar: user.avatar,
        token,
        // refreshToken,
        provider: 'google',
      }).toString();

      // 重定向到前端的处理路由
      res.json({ redirect: `${FE_URL}/auth/callback?${queryParams}` });
      return;
    }

    /**
     * 生成唯一用户名
     */
    let username = await authUtils.genUniqueName(displayName);
    let password = await authUtils.hashPassword(oauth_id);

    const [result] = await pool.execute(
      'INSERT INTO users (username, password, avatar, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)',
      [username, password, avatar, 'google', oauth_id]
    );

    const userId = result.insertId;
    const token = authUtils.genToken({ username, userId });
    const refreshToken = authUtils.genRefreshToken({ username, userId });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      // maxAge: 24 * 60 * 60 * 1000, // 24小时
    });

    // 修改返回逻辑，不直接返回JSON，而是重定向到前端
    const queryParams = new URLSearchParams({
      userId: userId.toString(),
      username,
      avatar,
      token,
      // refreshToken,
      provider: 'github',
    }).toString();

    // 重定向到前端的处理路由
    res.json({ redirect: `${FE_URL}/auth/callback?${queryParams}` });
  } catch (err) {
    console.error(err);
    res.redirect(`${FE_URL}/auth/callback?error=登录失败`);
  }
};

export const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const success = await emailLogin.sendCode(email);
    res.json({ success });
  } catch (err) {
    console.error('发送验证码失败:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '发送验证码失败' });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const response = await emailLogin.handleCallback(email, code);
    res.json({ response });
  } catch (err) {
    console.error('验证验证码失败:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: '验证验证码失败' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const [existingNames] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    const [existingEmails] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingNames.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: '用户名已被占用' });
    }
    if (existingEmails.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: '邮箱已被占用' });
    }

    const hashedPassword = await authUtils.hashPassword(password);

    const defaultAvatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${username}`;
    const [result] = await pool.execute('INSERT INTO users (username, password, avatar, email) VALUES (?, ?, ?, ?)', [
      username,
      hashedPassword,
      defaultAvatar,
      email,
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
        email,
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
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [
      username,
      username,
    ]);
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

    console.log('token: ', authUtils.verifyToken(token));
    console.log('refreshToken: ', authUtils.verifyToken(refreshToken));
    console.log('re:', refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      // maxAge: 24 * 60 * 60 * 1000, // 24小时
    });

    // 登录成功，返回用户信息和 JWT
    res.status(StatusCodes.OK).json({
      message: '登录成功',
      user: {
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
      },
      token,
      // refreshToken,
    });
  } catch (err) {
    console.error('登录验证出错：', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '服务器内部错误' });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('^^', refreshToken);

  try {
    const decoded = authUtils.verifyToken(refreshToken);
    // console.log('!!', decoded, Date.now());
    const newToken = authUtils.genToken({ userId: decoded.userId, username: decoded.username });
 
    res.json({ token: newToken });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token 已失效，请重新登录' });
  }
};
