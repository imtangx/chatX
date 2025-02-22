import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useDialog } from '../../context/DialogContext';
import { MessageInputBox, MessageList } from './';
const { Header, Footer, Sider, Content } = Layout;
import { useUserStore } from '../../store/userStore';
import { useWebSocketStore } from '../../store/wsStore';
import { WebSocketMessage } from '@chatx/types';
import { App } from 'antd';

interface ChatWindowProps {
  isDark: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isDark }) => {
  const { message } = App.useApp();
  const { activeDialog } = useDialog();
  const { username } = useUserStore();
  const { sendMessage } = useWebSocketStore();

  const handleSendMessage = (text: string) => {
    if (!activeDialog) {
      return;
    }
    const websocketMessage: WebSocketMessage = {
      type: 'chat',
      text,
      sender: username!,
      receiver: activeDialog,
      timestamp: new Date().toISOString(),
    };
    try {
      sendMessage(websocketMessage);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <Layout style={{ background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
      <Header
        style={{
          background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
          borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        {activeDialog ? `当前对话: ${activeDialog}` : '请选择对话'}
      </Header>
      <Content
        style={{
          height: '100%',
          background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
          borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <MessageList activeDialog={activeDialog!} />
      </Content>
      <Footer
        style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)', padding: '15px' }}
      >
        <MessageInputBox handleSendMessage={handleSendMessage}></MessageInputBox>
      </Footer>
    </Layout>
  );
};

export default ChatWindow;
