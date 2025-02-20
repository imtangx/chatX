import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './websocketHandlers.js';

let wss;

export const initializeWebSocketServer = server => {
  /** 不绑定到独立的端口 */
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('listening', () => {
    console.log('WebSocket 服务已准备好');
  });

  wss.on('connection', handleWebSocketConnection);

  wss.on('error', error => {
    console.error('WebSocket 服务器错误:', error);
  });

  console.log('WebSocket 服务器初始化完成');
  return wss;
};
