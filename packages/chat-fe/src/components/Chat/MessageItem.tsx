import React from 'react';
import { List, Avatar } from 'antd';
import { useUserStore } from '../../store/userStore';

interface MessageItemProps {
  style?: React.CSSProperties;
  message: string;
  isSelf: boolean;
  timestamp?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ style, message, isSelf, timestamp }) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai',
    });
  };

  const {avatar} = useUserStore();

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        padding: '4px 8px',
      }}
    >
      <Avatar src={avatar}></Avatar>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSelf ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            background: isSelf ? '#1296db' : 'inherit',
            padding: '8px 12px',
            borderRadius: '12px',
            position: 'relative',
            wordBreak: 'break-word',
            maxWidth: '70%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            borderTopRightRadius: isSelf ? '4px' : '12px',
            borderTopLeftRadius: isSelf ? '12px' : '4px',
          }}
        >
          {message}
        </div>
        {timestamp && (
          <div
            style={{
              fontSize: '12px',
              color: '#999',
              marginTop: '4px',
              padding: '0 4px',
            }}
          >
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageItem);
