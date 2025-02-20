import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initializeWebSocketServer } from './websocket/websocketServer.js';
import http from 'http';

const app = express();
const port = 3001;

/** 中间件 */
app.use(express.json());
app.use(cors());

/** 路由 */
app.use('/auth', authRoutes);
app.use('/friends', friendRoutes);
app.use('/messages', messageRoutes);

const server = http.createServer(app);

/** 初始化 WebSocket 服务器，并将 HTTP 服务器实例传递给它 */
initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`后端服务成功在 ${port} 端口启动`);
});
