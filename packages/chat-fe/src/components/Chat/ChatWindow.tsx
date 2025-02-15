import React from 'react';
import { Layout } from 'antd';
import { useDialog } from '../../context/DialogContext';
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
        聊天框
      </Content>
      <Footer style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>输入框</Footer>
    </Layout>
  );
};

export default ChatWindow;