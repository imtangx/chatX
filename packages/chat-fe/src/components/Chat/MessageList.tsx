import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';
import { Message } from '@chatx/types';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

interface MessageListProps {
  activeDialog: string;
  socket: WebSocket;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog, socket }) => {
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

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.sender === activeDialog || (data.sender === username && data.receiver === activeDialog)) {
        setMessages(prev => [...prev, data]);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, activeDialog]);

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
