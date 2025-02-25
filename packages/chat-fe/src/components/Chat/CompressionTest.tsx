import React, { useState } from 'react';
import { Button, Input, Card, Typography } from 'antd';
import { compressMessage } from '../../utils/compression';
import { WebSocketMessage } from '@chatx/types';

const { Text } = Typography;

const CompressionTest: React.FC = () => {
  const [results, setResults] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null);

  const runTest = () => {
    // 生成一个大的测试消息
    const testMessage: WebSocketMessage = {
      type: 'chat',
      text: '这是一条测试消息'.repeat(1000), 
      sender: 'testUser',
      receiver: 'testReceiver',
      timestamp: new Date().toISOString()
    };

    // 计算原始大小
    const originalData = JSON.stringify(testMessage);
    const originalSize = new TextEncoder().encode(originalData).length;

    // 压缩数据
    const compressed = compressMessage(testMessage);
    const compressedSize = compressed?.length || 0;

    // 计算压缩比
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    setResults({
      originalSize,
      compressedSize,
      compressionRatio
    });
  };

  return (
    <Card title="消息压缩效率测试" style={{ margin: '20px' }}>
      <Button type="primary" onClick={runTest}>
        运行压缩测试
      </Button>
      
      {results && (
        <div style={{ marginTop: '20px' }}>
          <Text>原始大小: {results.originalSize} bytes</Text>
          <br />
          <Text>压缩后大小: {results.compressedSize} bytes</Text>
          <br />
          <Text>压缩比: {results.compressionRatio.toFixed(2)}%</Text>
        </div>
      )}
    </Card>
  );
};

export default CompressionTest; 