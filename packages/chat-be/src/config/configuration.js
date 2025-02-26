import dotenv from 'dotenv';

// 根据 NODE_ENV 环境变量选择合适的 .env 文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export const secretKey = 'imtxCanGetOffer';

export const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
};

export const websocketConfig = {
  api_url: process.env.API_URL,
  ws_url: process.env.WS_URL,
};

export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  authCode: process.env.EMAIL_AUTH_CODE,
  from: process.env.EMAIL_FROM,
};

export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL,
};