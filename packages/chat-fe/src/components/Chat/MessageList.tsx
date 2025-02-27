import React, { useState, useEffect, useRef, ReactNode, SyntheticEvent } from 'react';
import MessageItem from './MessageItem';
import { WebSocketMessage } from '@chatx/types';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { useWebSocketStore } from '../../store/wsStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import {config} from '../../config';

interface MessageListProps {
  activeDialog: string;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog }) => {
  const { username } = useUserStore();
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageSize = 15;
  const lastChatMessage = useWebSocketStore(state => state.lastChatMessage);

  const loadMessages = async () => {
    if (!hasMore) return;
    try {
      const res = await axios.get(`${config.API_URL}/messages`, {
        params: {
          sender_name: username,
          receiver_name: activeDialog,
          last_message_id: lastMessageId,
          page_size: pageSize,
        },
      });

      const newMessages = res.data.messages;
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        setLastMessageId(newMessages[newMessages.length - 1].id);
        if (newMessages.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('加载消息失败', err);
      setHasMore(false);
    }
  };

  const scrollToButtom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (!lastChatMessage) return;
    if (!activeDialog) return;

    const isCurrentDialog =
      (lastChatMessage.sender === activeDialog && lastChatMessage.receiver === username) ||
      (lastChatMessage.sender === username && lastChatMessage.receiver === activeDialog);

    if (!isCurrentDialog) {
      return;
    }
    setMessages(prevMessages => [lastChatMessage, ...prevMessages]);
    if (lastChatMessage.sender === username) {
      scrollToButtom();
    }
  }, [lastChatMessage]);

  useEffect(() => {
    if (!activeDialog) return;
    setMessages([]);
    setLastMessageId(null);
    setHasMore(true);
    loadMessages();
  }, [activeDialog]);

  return (
    <div
      ref={containerRef}
      id='container'
      style={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMessages}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget='container'
        inverse={true}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        endMessage={<h4>没有更多消息啦！</h4>}
      >
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message.text!}
            isSelf={message.sender === username}
            timestamp={message.timestamp}
          ></MessageItem>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default MessageList;
