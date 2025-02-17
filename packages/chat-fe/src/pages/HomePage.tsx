import React, { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Button, ConfigProvider, theme } from 'antd';
import { DialogList, LeftSider, FriendList } from '../components/Sidebar';
import { ChatWindow } from '../components/Chat';
import { FriendRequestWindow } from '../components/Friend';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

interface HomePageProps {
  isDark: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  const getInitActiveItem = () => {
    const storedActiveItem = localStorage.getItem('activeItem');
    return storedActiveItem ? JSON.parse(storedActiveItem) : 'chat';
  };
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>(getInitActiveItem);
  const username = localStorage.getItem('username');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001?username=${encodeURIComponent(username!)}`);
    setSocket(socket);

    socket.onopen = () => {
      console.log('Websocket连接成功');
    };

    socket.onmessage = event => {
      console.log('收到消息：', event.data);
    };

    socket.onclose = () => {
      console.log('Websocket连接关闭');
    };
    
    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [username]);

  const handleItemClick = (id: string) => {
    setActiveItem(prevActiveItem => {
      localStorage.setItem('activeItem', JSON.stringify(id));
      return id;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
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
      {activeItem === 'chat' && <ChatWindow isDark={isDark} socket={socket!}></ChatWindow>}
      {activeItem === 'friends' && <FriendRequestWindow isDark={isDark}></FriendRequestWindow>}
    </Layout>
  );
};

export default HomePage;
