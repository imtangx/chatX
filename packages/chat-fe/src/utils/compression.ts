import { WebSocketMessage } from '@chatx/types';
import pako from 'pako';

export const compressMessage = (message: unknown): Uint8Array => {
  try {
    const jsonString = JSON.stringify(message);
    const uint8Array = new TextEncoder().encode(jsonString);
    return pako.deflate(uint8Array);
  } catch (error) {
    console.error('压缩消息失败:', error);
    throw error;
  }
};

export const decompressMessage = (compressed: Uint8Array): WebSocketMessage => {
  try {
    const decompressed = pako.inflate(compressed);
    const jsonString = new TextDecoder().decode(decompressed);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解压消息失败:', error);
    throw error;
  }
};