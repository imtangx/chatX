import React, { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';
import { Message } from '@chatx/types';
import axios from 'axios';
import { userEvent } from '@storybook/test';

interface MessageListProps {
  activeDialog: string;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const sender_name = localStorage.getItem('username');
  const receiver_name = activeDialog;
  useEffect(() => {
    const loadMessages = async () => {
      const res = await axios.get(`http://localhost:3001/messages`, {
        params: {
          sender_name: encodeURIComponent(sender_name!),
          receiver_name: encodeURIComponent(receiver_name!),
        },
      });
      setMessages(res.data.messages);
    };
    loadMessages();
  }, [receiver_name]);

  return (
    <List
      style={{ height: '100%', width: '100%', overflow: 'auto' }}
      dataSource={messages}
      renderItem={msg => <MessageItem message={msg.text} isSelf={msg.sender === sender_name}></MessageItem>}
    ></List>
  );
};

export default MessageList;
