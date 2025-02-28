export interface WebSocketMessage {
  type: 'chat' | 'heartbeat' | 'friendRequest';
  text?: string;
  sender?: string;
  receiver?: string;
  timestamp?: string;
  id?: number;
}
