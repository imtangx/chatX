import React, { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Button, ConfigProvider, theme } from 'antd';
import { DialogList, LeftSider, FriendList } from '../components/Sidebar';
import { ChatWindow } from '../components/Chat';
import { FriendRequestWindow } from '../components/Friend';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useWebSocketStore } from '../store/wsStore';
import { App } from 'antd';
import {config} from '../config'

const { Header, Footer, Sider, Content } = Layout;

interface HomePageProps {
  isDark: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  const getInitActiveItem = () => {
    const storedActiveItem = localStorage.getItem('activeItem');
    return storedActiveItem ? JSON.parse(storedActiveItem) : 'chat';
  };
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>(getInitActiveItem);
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
    setActiveItem(prevActiveItem => {
      localStorage.setItem('activeItem', JSON.stringify(id));
      return id;
    });
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user-storage');
    localStorage.removeItem('activeItem');
    localStorage.removeItem('activeDialog');
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
          activeItem={activeItem}
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
            <div style={{ display: 'flex', width: '100%' }}>
              <form style={{ display: 'flex', margin: '15px 20px', width: '100%' }}>
                <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
                  <Input type='text' placeholder='搜索' variant='filled'></Input>
                </ConfigProvider>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<SearchOutlined />}
                  style={{ marginLeft: '5px' }}
                ></Button>
              </form>
            </div>
          </Header>
          <Content style={{ background: isDark ? 'rgb(32, 32, 32)' : 'rgb(243, 243, 243)', display: 'flex' }}>
            {activeItem === 'chat' && <DialogList isDark={isDark}></DialogList>}
            {activeItem === 'friends' && <FriendList></FriendList>}
          </Content>
        </Layout>
      </Sider>
      {activeItem === 'chat' && <ChatWindow isDark={isDark}></ChatWindow>}
      {activeItem === 'friends' && <FriendRequestWindow isDark={isDark}></FriendRequestWindow>}
    </Layout>
  );
};

export default HomePage;
