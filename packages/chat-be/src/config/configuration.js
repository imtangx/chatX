import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 根据 NODE_ENV 环境变量选择合适的 .env 文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export const secretKey = 'imtxCanGetOffer';

export const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
}

export const websocketConfig = {
  api_url: process.env.API_URL,
  ws_url: process.env.WS_URL,
}