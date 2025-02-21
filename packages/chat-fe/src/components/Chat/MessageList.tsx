import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';
import { Message } from '@chatx/types';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

interface MessageListProps {
  activeDialog: string;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { username } = useUserStore();
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await axios.get(`http://localhost:3001/messages`, {
        params: {
          sender_name: username,
          receiver_name: activeDialog,
        },
      });
      setMessages(res.data.messages);
    };
    loadMessages();
  }, [activeDialog]);

  return (
    <List
      ref={listRef}
      style={{ height: '100%', width: '100%', overflow: 'auto' }}
      dataSource={messages}
      renderItem={msg => <MessageItem message={msg.text} isSelf={msg.sender === username} timestamp={msg.timestamp} />}
    />
  );
};

export default MessageList;
