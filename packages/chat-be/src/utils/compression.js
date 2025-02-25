import pako from 'pako';

// 设置压缩阈值为1KB
const COMPRESSION_THRESHOLD = 1024; // 1KB

export const compressMessage = (message) => {
  try {
    // 将消息转换为 JSON 字符串
    const jsonString = JSON.stringify(message);
    // 转换为 Uint8Array
    const uint8Array = new TextEncoder().encode(jsonString);
    
    // 如果消息大小小于阈值，直接返回原始数据
    if (uint8Array.length < COMPRESSION_THRESHOLD) {
      return {
        data: uint8Array,
        compressed: false
      };
    }

    // 压缩数据
    const compressed = pako.deflate(uint8Array);
    return {
      data: compressed,
      compressed: true
    };
  } catch (error) {
    console.error('压缩消息失败:', error);
    return null;
  }
};

export const decompressMessage = (data, isCompressed) => {
  try {
    if (!isCompressed) {
      // 如果数据未压缩，直接解析
      const jsonString = new TextDecoder().decode(data);
      return JSON.parse(jsonString);
    }

    // 解压数据
    const decompressed = pako.inflate(data);
    // 转换回字符串
    const jsonString = new TextDecoder().decode(decompressed);
    // 解析 JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解压消息失败:', error);
    return null;
  }
};