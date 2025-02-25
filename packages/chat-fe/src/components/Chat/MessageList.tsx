import React, { useState, useEffect, useRef, ReactNode, SyntheticEvent } from 'react';
import MessageItem from './MessageItem';
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
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [listHeight, setListHeight] = useState<number>(0);

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

  const handleScroll = (e: SyntheticEvent<EventTarget>) => { // 类型标注 e 为 UIEvent<HTMLDivElement>
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    setScrollOffset(scrollTop);
  };

  useEffect(() => {
    if (listRef.current) {
      const height = listRef.current.getBoundingClientRect().height;
      setListHeight(height);
    }
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

  const getCurrentDialog = () => {
    const items: ReactNode[] = [];
    const startIndex = Math.max(0, Math.floor(scrollOffset / 70) - 2);
    const nums = Math.ceil(listHeight / 70);
    const endIndex = Math.min(startIndex + nums + 2, messages.length - 1);

    for (let i = startIndex; i <= endIndex; i++) {
      const itemStyle: React.CSSProperties = {
        position: 'absolute',
        top: 70 * i,
        width: '100%',
      };
      items.push(
        <MessageItem
          style={itemStyle}
          key={i}
          message={messages[i].text!}
          isSelf={messages[i].sender === username}
          timestamp={messages[i].timestamp}
        />
      );
    }

    return items;
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      style={{ position: 'relative', height: '100%', width: '100%', overflow: 'auto' }}
    >
      <div style={{ height: messages.length * 70 }}>{getCurrentDialog()}</div>
    </div>
  );
};

export default MessageList;
