import pako from 'pako';

export const compressMessage = (message) => {
  try {
    // 将消息转换为 JSON 字符串
    const jsonString = JSON.stringify(message);
    // 转换为 Uint8Array
    const uint8Array = new TextEncoder().encode(jsonString);
    // 压缩数据
    const compressed = pako.deflate(uint8Array);
    return compressed;
  } catch (error) {
    console.error('压缩消息失败:', error);
    return null;
  }
};

export const decompressMessage = (compressed) => {
  try {
    // 解压数据
    const decompressed = pako.inflate(compressed);
    // 转换回字符串
    const jsonString = new TextDecoder().decode(decompressed);
    // 解析 JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解压消息失败:', error);
    return null;
  }
};