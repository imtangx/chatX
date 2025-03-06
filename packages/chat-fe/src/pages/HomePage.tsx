import React, { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Button, ConfigProvider, theme } from 'antd';
import { DialogList, LeftSider, FriendList, SearchBox } from '../components/Sidebar';
import { ChatWindow } from '../components/Chat';
import { FriendRequestWindow } from '../components/Friend';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useWebSocketStore } from '../store/wsStore';
import { useHomeStore } from '../store/homeStore';
import { App } from 'antd';
import { config } from '../config';

const { Header, Footer, Sider, Content } = Layout;

interface HomePageProps {
  isDark: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const {activeMenuItem, setActiveMenuItem} = useHomeStore();
  const { username, logout } = useUserStore();
  const { connect, disconnect, isReconnecting } = useWebSocketStore();
  useEffect(() => {
    connect(`${config.WS_URL}?username=${encodeURIComponent(username!)}`);
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    let loadingMessage: ReturnType<typeof message.loading> | null = null;
    if (isReconnecting) {
      loadingMessage = message.loading('正在重新连接服务器...', 0);
    }
    return () => {
      if (loadingMessage) {
        // 销毁消息
        loadingMessage();
      }
    };
  }, [isReconnecting]);

  const handleItemClick = (id: string) => {
    setActiveMenuItem(id);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user-storage');
    localStorage.removeItem('home-storage');
    navigate('/auth/login');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width='5%'
        style={{
          background: isDark ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <LeftSider
          isDark={isDark}
          handleItemClick={handleItemClick}
          handleLogout={handleLogout}
        />
      </Sider>
      <Sider
        width='25%'
        style={{
          background: isDark ? 'rgb(32, 32, 32)' : 'rgb(247, 247, 247)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Layout style={{ height: '100%' }}>
          <Header
            style={{
              display: 'flex',
              padding: '0',
              background: isDark ? 'rgb(32, 32, 32)' : 'rgb(247, 247, 247)',
            }}
          >
            <SearchBox />
          </Header>
          <Content style={{ background: isDark ? 'rgb(32, 32, 32)' : 'rgb(243, 243, 243)', display: 'flex' }}>
            {activeMenuItem === 'chat' && <DialogList></DialogList>}
            {activeMenuItem === 'friends' && <FriendList></FriendList>}
          </Content>
        </Layout>
      </Sider>
      {activeMenuItem === 'chat' && <ChatWindow isDark={isDark}></ChatWindow>}
      {activeMenuItem === 'friends' && <FriendRequestWindow isDark={isDark}></FriendRequestWindow>}
    </Layout>
  );
};

export default HomePage;
