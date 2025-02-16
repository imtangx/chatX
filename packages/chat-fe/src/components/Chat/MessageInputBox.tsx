import React, { useState } from 'react';
import { Input } from 'antd';

const MessageInputBox = () => {
  const [messageInput, setMessageInput] = useState<string>('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('发送消息:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Input.TextArea
        placeholder='键入消息...'
        style={{ height: '100%' }}
        value={messageInput}
        onChange={handleMessageChange}
        onPressEnter={handleSendMessage}
      ></Input.TextArea>
    </div>
  );
};

export default MessageInputBox;
