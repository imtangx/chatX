import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';
import { WebSocketMessage } from '@chatx/types';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { useWebSocketStore } from '../../store/wsStore';

interface MessageListProps {
  activeDialog: string;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog }) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const lastChatMessage = useWebSocketStore(state => state.lastChatMessage);
  const { username } = useUserStore();
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  useEffect(() => {
    if (!lastChatMessage) return;

    const isCurrentDialog =
      (lastChatMessage.sender === activeDialog && lastChatMessage.receiver === username) ||
      (lastChatMessage.sender === username && lastChatMessage.receiver === activeDialog);

    if (!isCurrentDialog) {
      return;
    }
    
    setMessages(prevMessages => [...prevMessages, lastChatMessage]);
    scrollToBottom();
  }, [lastChatMessage, activeDialog, username]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/messages`, {
          params: {
            sender_name: username,
            receiver_name: activeDialog,
          },
        });
        setMessages(res.data.messages);
        scrollToBottom();
      } catch (error) {
        console.error('加载消息失败:', error);
      }
    };

    if (activeDialog) {
      loadMessages();
    }
  }, [activeDialog]);

  return (
    <List
      ref={listRef}
      style={{ height: '100%', width: '100%', overflow: 'auto' }}
      dataSource={messages}
      renderItem={msg => <MessageItem message={msg.text!} isSelf={msg.sender === username} timestamp={msg.timestamp} />}
    />
  );
};

export default MessageList;
