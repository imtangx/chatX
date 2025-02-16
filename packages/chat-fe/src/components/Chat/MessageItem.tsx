import React from 'react';
import { List, Avatar } from 'antd';

interface MessageItemProps {
  message: string;
  isSelf: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSelf }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        padding: '4px 8px',
      }}
    >
      <Avatar src='https://api.dicebear.com/7.x/miniavs/svg?seed=1'></Avatar>
      <div
        style={{
          background: isSelf ? '#1296db' : '#F5F5F5',
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
    </div>
  );
};

export default MessageItem;
