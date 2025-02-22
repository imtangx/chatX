export interface WebSocketMessage {
  type: 'chat' | 'heartbeat';
  text?: string,
  sender?: string,
  receiver?: string,
  timestamp?: string,
}