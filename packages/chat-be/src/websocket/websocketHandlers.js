import { pool } from '../database/databaseServer.js';
import { websocketConfig } from '../config/configuration.js';

const connections = new Map();

export const handleWebSocketConnection = (ws, req) => {
  const urlParams = new URL(req.url, websocketConfig.api_url).searchParams;
  const username = urlParams.get('username');

  if (username) {
    connections.set(username, ws);
    console.log(`用户${username}连接成功`);
  }

  ws.on('message', async message => {
    try {
      const messageData = JSON.parse(message.toString());
      console.log(`收到${username}发来的消息：`, messageData);

      /** 存储消息到数据库 */
      const { text, sender, receiver } = messageData;
      const [result] = await pool.execute('INSERT INTO messages (text, sender, receiver) VALUES (?, ?, ?)', [
        text,
        sender,
        receiver,
      ]);

      const [newMessage] = await pool.execute(
        'SELECT id, text, sender, receiver, created_at FROM messages WHERE id = ?',
        [result.insertId]
      );

      const messageToSend = {
        id: result.insertId,
        text,
        sender,
        receiver,
        timestamp: newMessage[0].created_at,
      };

      /** 发送给接收者 */
      const receiverWs = connections.get(receiver);
      if (receiverWs) {
        receiverWs.send(JSON.stringify(messageToSend));
      }

      /** 发送给发送者 */
      const senderWs = connections.get(sender);
      if (senderWs) {
        senderWs.send(JSON.stringify(messageToSend));
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
