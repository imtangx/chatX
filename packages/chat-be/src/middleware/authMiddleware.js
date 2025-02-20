import { StatusCodes } from 'http-status-codes';
import * as authUtils from '../utils/auth.js';

/** 验证请求头中的 JWT Token，并将用户信息添加到 req.user */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: '未提供Token，拒绝访问' });
  }

  const decoded = authUtils.verifyToken(token);

  if (!decoded) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token无效或已过期' }); // 401 - Token 无效或过期
  }

  req.user = decoded;
  next();
};
