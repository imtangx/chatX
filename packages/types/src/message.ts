export interface WebSocketMessage {
  id: number;
  type: 'chat' | 'heartbeat' | 'friendRequest';
  text?: string;
  sender?: string;
  receiver?: string;
  timestamp?: string;
}
