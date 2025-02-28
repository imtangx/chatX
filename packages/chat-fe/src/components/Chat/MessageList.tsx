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
  const [visibleMessages, setVisibleMessages] = useState<WebSocketMessage[]>([]);
  const itemHeight = 70;
  const totalHeight = useRef<number>(0);
  const heightCache = useRef<{ [id: number]: number }>({});
  const itemOffset = useRef<{ [id: number]: number }>({});

  useEffect(() => {
    if (!activeDialog) return;
    calcVisibleMessages();
  }, [messages, lastChatMessage, activeDialog, containerRef]);

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
    setVisibleMessages([]);
    setHasMore(true);
    lastMessageId.current = null;
    totalHeight.current = 0;
    heightCache.current = {};
    itemOffset.current = {};
    loadMessages();
  }, [activeDialog]);

  const updateHeight = (id: number, height: number) => {
    if (heightCache.current[id] === height) return;
    heightCache.current[id] = height;

    let prefix = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msgid = messages[i].id;
      itemOffset.current[msgid] = prefix;
      prefix += heightCache.current[msgid] || itemHeight;
    }

    totalHeight.current = prefix;
    calcVisibleMessages();
  };

  const handleScroll = () => {
    if (containerRef.current) {
      calcVisibleMessages();
    }
  };

  const calcVisibleMessages = () => {
    if (!containerRef.current) return;
    const scrollTop = -containerRef.current.scrollTop;

    const containerHeight = containerRef.current.clientHeight || 500;
    let startIndex = 0,
      endIndex = 0,
      currentOffset = 0;

    while (
      startIndex < messages.length - 1 &&
      currentOffset + (heightCache.current[messages[startIndex].id] || itemHeight) < scrollTop
    ) {
      currentOffset += heightCache.current[messages[startIndex].id] || 0;
      startIndex++;
    }

    endIndex = startIndex;
    while (endIndex < messages.length && currentOffset < scrollTop + containerHeight) {
      currentOffset += heightCache.current[messages[endIndex].id] || 0;
      endIndex++;
    }

    startIndex = Math.max(0, startIndex - 2);
    endIndex = Math.min(messages.length - 1, endIndex + 2);

    setVisibleMessages(messages.slice(startIndex, endIndex + 1));
  };

  const renderMessageItem = (message: WebSocketMessage): ReactNode => {
    const offset = itemOffset.current[message.id];
    return (
      <div
        key={message.id}
        ref={el => {
          if (!el) return;
          // 测量实际高度
          const height = el.getBoundingClientRect()?.height;
          updateHeight(message.id, height);
        }}
        style={{
          position: 'absolute',
          top: `${offset}px`,
          width: '100%',
        }}
      >
        <MessageItem message={message.text!} isSelf={message.sender === username} timestamp={message.timestamp} />
      </div>
    );
  };

  const loadMessages = async () => {
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
        calcVisibleMessages();
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
        {/* <div style={{ height: `${messages.length * itemHeight}px`, position: 'relative' }}>
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
        </div> */}
        <div style={{ height: `${totalHeight?.current || 600}px`, position: 'relative' }}>
          {visibleMessages.map(renderMessageItem)}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MessageList;
