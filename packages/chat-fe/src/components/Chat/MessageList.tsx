import React from 'react';
import MessageItem from './MessageItem';
import { List } from 'antd';

interface MessageListProps {}

interface Message {
  text: string;
  sender: string;
  receiver: string;
  isSelf: boolean;
}

const MessageList: React.FC = () => {
  const testMessages: Message[] = [
    {
      text: '嘿，你怎么样？',
      sender: 'imtx',
      receiver: 'bubu',
      isSelf: false,
    },
    {
      text: '我挺好的，谢谢！你呢？',
      sender: 'bubu',
      receiver: 'imtx',
      isSelf: true,
    },
    {
      text: '我也很好！有个激动人心的消息。',
      sender: 'imtx',
      receiver: 'bubu',
      isSelf: false,
    },
    {
      text: '哦，是什么？快告诉我！',
      sender: 'bubu',
      receiver: 'imtx',
      isSelf: true,
    },
    {
      text: '我刚刚收到了一个新的工作机会！超级激动！',
      sender: 'imtx',
      receiver: 'bubu',
      isSelf: false,
    },
    {
      text: '太棒了！恭喜你！！🎉',
      sender: 'bubu',
      receiver: 'imtx',
      isSelf: true,
    },
    {
      text: '谢谢！我还是有点震惊😅',
      sender: 'imtx',
      receiver: 'bubu',
      isSelf: false,
    },
    {
      text: '你一定会做得很棒的！等不及要听你的故事了。',
      sender: 'bubu',
      receiver: 'imtx',
      isSelf: true,
    },
  ];

  return (
    <List
      style={{ height: '100%', width: '100%', overflow: 'auto' }}
      dataSource={testMessages}
      renderItem={msg => <MessageItem message={msg.text} isSelf={msg.isSelf}></MessageItem>}
    ></List>
  );
};

export default MessageList;
