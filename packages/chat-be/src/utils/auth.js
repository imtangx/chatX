import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/configuration.js';
import { pool } from '../database/databaseServer.js';

export const hashPassword = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const genToken = payload => {
  return jwt.sign(payload, secretKey, {
    expiresIn: '15m',
  });
};

export const genRefreshToken = payload => {
  return jwt.sign(payload, secretKey, {
    expiresIn: '1d',
  });
};

export const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const genUniqueName = async username => {
  let suffix = 0;
  let resultName = username;

  while (true) {
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [
      resultName,
      resultName,
    ]);
    if (existingUsers.length === 0) {
      return resultName;
    }

    suffix++;
    resultName = username + '_' + suffix.toString();
  }
};
