import React, { useState, useEffect, useRef, ReactNode, SyntheticEvent } from 'react';
import MessageItem from './MessageItem';
import { WebSocketMessage } from '@chatx/types';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { useWebSocketStore } from '../../store/wsStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import { config } from '../../config';

interface MessageListProps {
  activeDialog: string;
}

const MessageList: React.FC<MessageListProps> = ({ activeDialog }) => {
  const { username } = useUserStore();
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastMessageId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageSize = 15;
  const lastChatMessage = useWebSocketStore(state => state.lastChatMessage);

  /**
   *  虚拟列表相关
   */
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [visibleMessages, setVisibleMessages] = useState<WebSocketMessage[]>([]); // 当前可见的消息
  const itemHeight = 70; // 每条消息的高度（根据实际情况调整）
  const containerHeight = containerRef.current?.clientHeight || 500; // 容器高度

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
      calcVisibleMessages();
    }
  };

  const calcVisibleMessages = () => {
    if (!containerRef.current) return;
    const startIndex = Math.max(0, Math.floor(-scrollTop / itemHeight) - 3);
    const endIndex = Math.min(messages.length - 1, startIndex + Math.ceil(containerHeight / itemHeight) + 3);
    setVisibleMessages(messages.slice(startIndex, endIndex + 1));
  };

  useEffect(() => {
    if (!activeDialog) return;
    calcVisibleMessages();
  }, [messages, lastChatMessage, activeDialog, containerRef.current?.scrollTop]);

  const loadMessages = async () => {
    if (!hasMore) return;
    try {
      const res = await axios.get(`${config.API_URL}/messages`, {
        params: {
          sender_name: username,
          receiver_name: activeDialog,
          last_message_id: lastMessageId.current,
          page_size: pageSize,
        },
      });

      const newMessages = res.data.messages;
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        lastMessageId.current = newMessages[newMessages.length - 1].id;
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
      setTimeout(scrollToButtom, 0); /** 确保渲染消息后再到底部 */
    }
  }, [lastChatMessage]);

  useEffect(() => {
    if (!activeDialog) return;
    setMessages([]);
    lastMessageId.current = null;
    setHasMore(true);
    loadMessages();
  }, [activeDialog]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
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
        {/* {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message.text!}
            isSelf={message.sender === username}
            timestamp={message.timestamp}
          ></MessageItem>
        ))} */}
        <div style={{ height: `${messages.length * itemHeight}px`, position: 'relative' }}>
          {visibleMessages.map((message, index) => {
            const actualIndex = messages.length - 1 - messages.findIndex(msg => msg.id === message.id);
            return (
              <div
                key={message.id}
                style={{
                  position: 'absolute',
                  top: `${actualIndex * itemHeight}px`,
                  width: '100%',
                }}
              >
                <MessageItem
                  message={message.text!}
                  isSelf={message.sender === username}
                  timestamp={message.timestamp}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MessageList;
