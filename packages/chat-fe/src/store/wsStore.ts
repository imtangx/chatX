import { create } from 'zustand';
import { WebSocketMessage } from '@chatx/types';
import { compressMessage, decompressMessage } from '../utils/compression';

interface WebSocketState {
  socket: WebSocket | null;
  socketUrl: string;
  heartbeatStatus: 'waiting' | 'received';
  waitHeartbeatTimer: any;
  reHeartbeatCnt: number;
  reConnectCnt: number;
  isManualDisconnect: boolean;
  isReconnectFailed: boolean;
  isReconnecting: boolean;
  lastChatMessage: WebSocketMessage | null;
  setSocket: (socket: WebSocket) => void;
  setHeartbeatStatus: (heartbeatStatus: 'waiting' | 'received') => void;
  sendMessage: (message: WebSocketMessage) => void;
  sendHeartbeat: () => void;
  receiverMessage: (message: Uint8Array) => void;
  connect: (url: string) => void;
  disconnect: () => void;
  startHeartbeat: () => void;
  startReconnect: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  socketUrl: '',
  heartbeatStatus: 'waiting',
  waitHeartbeatTimer: undefined,
  reHeartbeatCnt: 0,
  reConnectCnt: 0,
  isManualDisconnect: false,
  isReconnectFailed: false,
  isReconnecting: false,
  lastChatMessage: null,
  setSocket: socket => set({ socket }),
  setHeartbeatStatus: heartbeatStatus => set({ heartbeatStatus }),
  sendMessage: message => {
    const { socket, heartbeatStatus } = get();
    console.log('^^', socket, heartbeatStatus);
    if (socket && socket.readyState === WebSocket.OPEN && heartbeatStatus === 'received') {
      const compressedResult = compressMessage(message);
      if (!compressedResult) return;

      const { data, compressed } = compressedResult;
      
      // 创建一个新的数组，第一个字节表示是否压缩
      const finalData = new Uint8Array(data.length + 1);
      finalData[0] = compressed ? 1 : 0;
      finalData.set(data, 1);
      
      socket.send(finalData);
    } else {
      throw new Error('您与服务器失去连接，发送消息失败！');
    }
  },
  sendHeartbeat: () => {
    const { socket } = get();
    if (socket) {
      const compressedResult = compressMessage({ id: 1, type: 'heartbeat' });
      if (!compressedResult) return;

      const { data, compressed } = compressedResult;
      const finalData = new Uint8Array(data.length + 1);
      finalData[0] = compressed ? 1 : 0;
      finalData.set(data, 1);
      
      socket.send(finalData);
    }
  },
  receiverMessage: data => {
    // 获取压缩标志和消息数据
    const isCompressed = data[0] === 1;
    const messageData = data.slice(1);
    
    const message = decompressMessage(messageData, isCompressed);
    if (!message) return;

    // console.log('接收到消息：', message);
    const { type, text, sender, receiver } = message;
    if (type === 'heartbeat') {
      get().setHeartbeatStatus('received');
      set({ reHeartbeatCnt: 0 });
    } else {
      console.log('接收到聊天消息：', message);
      set({ lastChatMessage: message });
    }
  },

  connect: url => {
    const socket = new WebSocket(url);
    set({ socketUrl: url });
    socket.onopen = event => {
      set({
        socket,
        reConnectCnt: 0,
        reHeartbeatCnt: 0,
        isManualDisconnect: false,
        isReconnectFailed: false,
        isReconnecting: false,
      });
      get().startHeartbeat();
      console.log('WebSocket 连接已打开');
    };

    socket.onmessage = async event => {
      try {
        // 将接收到的数据转换为 ArrayBuffer
        const buffer = await event.data.arrayBuffer();
        // 转换为 Uint8Array 并传递给 receiverMessage
        const uint8Array = new Uint8Array(buffer);
        get().receiverMessage(uint8Array);
      } catch (err: any) {
        console.error('解析 WebSocket 消息出错', err);
      }
    };

    socket.onclose = event => {
      console.log('WebSocket 连接已关闭');
      if (!get().isManualDisconnect) {
        get().startReconnect();
      }
    };

    socket.onerror = error => {
      set({ socket: null });
      if (!get().isManualDisconnect) {
        get().startReconnect();
      }
    };
  },

  disconnect: () => {
    const { socket } = get();
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      set({ isManualDisconnect: true });
      console.log(get().isManualDisconnect);
      socket.close();
      set({ socket: null, heartbeatStatus: 'waiting' }); // 更新状态
      clearTimeout(get().waitHeartbeatTimer);
      console.log('WebSocket 连接已手动关闭');
    }
  },

  startHeartbeat: () => {
    set({ heartbeatStatus: 'waiting' });
    if (get().isManualDisconnect) {
      return;
    }
    // console.log('心跳重试次数：', get().reHeartbeatCnt);
    const timerId = setTimeout(() => {
      if (get().heartbeatStatus === 'received') {
        /** 下一轮心跳检测 */
        get().startHeartbeat();
      } else {
        set({ reHeartbeatCnt: get().reHeartbeatCnt + 1 });
        if (get().reHeartbeatCnt <= 2) {
          /** 再发起两次心跳检测 */
          get().startHeartbeat();
        } else {
          /** 开始重连 */
          get().startReconnect();
        }
      }
    }, 3000);

    set({ waitHeartbeatTimer: timerId });
    get().sendHeartbeat();
  },

  startReconnect: () => {
    const { reConnectCnt, socketUrl, isReconnectFailed, isManualDisconnect } = get();
    if (isReconnectFailed || isManualDisconnect) {
      return;
    }

    if (reConnectCnt > 2) {
      console.log('以达到最大重连次数, 停止重连');
      set({ isReconnectFailed: true, isReconnecting: false });
      alert('您与服务器失去连接！请刷新页面重试');
      window.location.reload();
      return;
    }

    set({ isReconnecting: true });

    // 指数退避重连策略
    const delay = Math.min(1000 * Math.pow(2, reConnectCnt), 30000); // 最大间隔30秒
    setTimeout(() => {
      console.log(`尝试重连第${reConnectCnt}次`);
      set({ reConnectCnt: reConnectCnt + 1 });
      get().connect(socketUrl);
    }, delay);
  },
}));
