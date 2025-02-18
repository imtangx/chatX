import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';
import { Message } from '@chatx/types';
import axios from 'axios';

interface MessageListProps {
  activeDialog: string;
  socket: WebSocket;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const sender_name = localStorage.getItem('username');
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
          sender_name: encodeURIComponent(sender_name!),
          receiver_name: encodeURIComponent(activeDialog),
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
      if (data.sender === activeDialog || (data.sender === sender_name && data.receiver === activeDialog)) {
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
      renderItem={msg => (
        <MessageItem message={msg.text} isSelf={msg.sender === sender_name} timestamp={msg.timestamp} />
      )}
    />
  );
};

export default MessageList;
