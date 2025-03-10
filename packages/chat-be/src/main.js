import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { initializeWebSocketServer } from './websocket/websocketServer.js';
import http from 'http';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

express.static(join(__dirname, 'uploads'));

const app = express();
const port = 3001;

/** 中间件 */
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://47.122.40.201'],
  credentials: true,
}));

/** 静态服务 */
app.use('/uploads', express.static(join(__dirname, 'uploads')));

/** 路由 */
app.use('/auth', authRoutes);
app.use('/friends', friendRoutes);
app.use('/messages', messageRoutes);
app.use('/upload', uploadRoutes);

const server = http.createServer(app);

/** 初始化 WebSocket 服务器，并将 HTTP 服务器实例传递给它 */
initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`后端服务成功在 ${port} 端口启动`);
});
