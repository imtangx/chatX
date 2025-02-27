import { pool } from '../database/databaseServer.js';
import { websocketConfig } from '../config/configuration.js';
import { compressMessage, decompressMessage } from '../utils/compression.js';

const connections = new Map();

export const handleWebSocketConnection = (ws, req) => {
  const urlParams = new URL(req.url, websocketConfig.api_url).searchParams;
  const username = urlParams.get('username');

  if (username) {
    connections.set(username, ws);
    console.log(`用户${username}连接成功`);
  }

  ws.on('message', async data => {
    try {
      // 获取压缩标志和消息数据
      const isCompressed = data[0] === 1;
      const messageData = data.slice(1);
      
      const message = decompressMessage(messageData, isCompressed);
      // console.log(`收到${username}发来的消息：`, message);

      const { type, text, sender, receiver } = message;

      /** 心跳检测 */
      if (type === 'heartbeat') {
        const senderWs = connections.get(username);
        // console.log('哈哈哈', username);
        if (senderWs) {
          const response = compressMessage({ type: 'heartbeat' });
          const finalData = new Uint8Array(response.data.length + 1);
          finalData[0] = response.compressed ? 1 : 0;
          finalData.set(response.data, 1);
          senderWs.send(finalData);
        }
        return;
      }

      /** 存储消息到数据库 */
      const [result] = await pool.execute('INSERT INTO messages (text, sender, receiver) VALUES (?, ?, ?)', [
        text,
        sender,
        receiver,
      ]);

      const [newMessage] = await pool.execute(
        'SELECT id, text, sender, receiver, created_at FROM messages WHERE id = ?',
        [result.insertId]
      );

      const messageToSend = compressMessage({
        type: 'chat',
        text,
        sender,
        receiver,
        timestamp: newMessage[0].created_at,
      });

      /** 准备发送的数据 */
      const finalData = new Uint8Array(messageToSend.data.length + 1);
      finalData[0] = messageToSend.compressed ? 1 : 0;
      finalData.set(messageToSend.data, 1);

      /** 发送给接收者 */
      const receiverWs = connections.get(receiver);
      if (receiverWs) {
        receiverWs.send(finalData);
      }

      /** 发送给发送者 */
      const senderWs = connections.get(sender);
      if (senderWs) {
        senderWs.send(finalData);
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
    }
  });

  ws.on('close', () => {
    if (connections.has(username)) {
      connections.delete(username);
      console.log(`用户 ${username} 断开连接`);
    }
  });
};
