import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/configuration.js';

export const hashPassword = async password => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const genToken = payload => {
  return jwt.sign(payload, secretKey, {
    expiresIn: '1h',
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
