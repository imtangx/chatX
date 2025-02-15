import React from 'react';
import { Layout } from 'antd';
import { useDialog } from '../../context/DialogContext';
import { MessageInputBox, MessageList } from './';
const { Header, Footer, Sider, Content } = Layout;

interface ChatWindowProps {
  isDark: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isDark }) => {
  const { activeDialog } = useDialog();

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
        <MessageList></MessageList>
      </Content>
      <Footer style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)', padding: '15px'}}>
        <MessageInputBox></MessageInputBox>
      </Footer>
    </Layout>
  );
};

export default ChatWindow;
