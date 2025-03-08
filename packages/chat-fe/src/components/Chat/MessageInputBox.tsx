import React, { useState } from 'react';
import { Input } from 'antd';
import { App} from 'antd';

interface MessageInputBoxProps {
  handleSendMessage: (message: string) => void;
}

const MessageInputBox: React.FC<MessageInputBoxProps> = ({ handleSendMessage }) => {
  const [messageInput, setMessageInput] = useState<string>('');
  const lastEnterTimeRef = React.useRef<number>(0);
  const {message} = App.useApp();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  };

  const handlePressEnter = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (Date.now() - lastEnterTimeRef.current < 1000) {
      message.warning('请勿频繁发送消息');
      return;
    }
    lastEnterTimeRef.current = Date.now();
    if (messageInput.trim()) {
      handleSendMessage(messageInput);
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
        onPressEnter={handlePressEnter}
      ></Input.TextArea>
    </div>
  );
};

export default MessageInputBox;
