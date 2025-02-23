import { create } from 'zustand';
import { WebSocketMessage } from '@chatx/types';

interface WebSocketState {
  socket: WebSocket | null;
  socketUrl: string;
  heartbeatStatus: 'waiting' | 'received';
  waitHeartbeatTimer: number | undefined;
  reHeartbeatCnt: number;
  reConnectCnt: number;
  isManualDisconnect: boolean;
  isReconnectFailed: boolean;
  isReconnecting: boolean;
  setSocket: (socket: WebSocket) => void;
  setHeartbeatStatus: (heartbeatStatus: 'waiting' | 'received') => void;
  sendMessage: (message: WebSocketMessage) => void;
  sendHeartbeat: () => void;
  receiverMessage: (message: WebSocketMessage) => void;
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
  setSocket: socket => set({ socket }),
  setHeartbeatStatus: heartbeatStatus => set({ heartbeatStatus }),
  sendMessage: message => {
    const { socket, heartbeatStatus } = get();
    console.log('^^', socket, heartbeatStatus);
    if (socket && socket.readyState === WebSocket.OPEN && heartbeatStatus === 'received') {
      socket.send(JSON.stringify(message));
    } else {
      throw new Error('您与服务器失去连接，发送消息失败！');
    }
  },
  sendHeartbeat: () => {
    const { socket } = get();
    if (socket) {
      socket.send(JSON.stringify({ type: 'heartbeat' }));
    }
  },
  receiverMessage: message => {
    console.log('接收到消息：', message);
    const { type, text, sender, receiver } = message;
    if (type === 'heartbeat') {
      console.log('心跳应答了');
      get().setHeartbeatStatus('received');
      set({ reHeartbeatCnt: 0 });
    }
  },

  connect: url => {
    const socket = new WebSocket(url);
    set({ socketUrl: url });
    socket.onopen = event => {
      set({ socket, reConnectCnt: 0, reHeartbeatCnt: 0, isManualDisconnect: false, isReconnectFailed: false, isReconnecting: false });
      get().startHeartbeat();
      console.log('WebSocket 连接已打开');
    };

    socket.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        get().receiverMessage(message);
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
    console.log('心跳重试次数：', get().reHeartbeatCnt);
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
