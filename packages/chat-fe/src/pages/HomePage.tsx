import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Button, ConfigProvider, theme } from 'antd';
import { LeftSider } from '../components/Sidebar';

const { Header, Footer, Sider, Content } = Layout;

const HomePage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('chat');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  const handleNightModeToggle = () => {
    setIsNightMode(!isNightMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login';
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width='5%' style={{ background: isNightMode ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)' }}>
        <LeftSider
          activeItem={activeItem}
          isNightMode={isNightMode}
          handleItemClick={handleItemClick}
          handleNightModeToggle={handleNightModeToggle}
          handleLogout={handleLogout}
        />
      </Sider>
      <Sider
        width='25%'
        style={{
          background: isNightMode ? 'rgb(32, 32, 32)' : 'rgb(247, 247, 247)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1',
        }}
      >
        <Layout style={{ height: '100%' }}>
          <Header
            style={{
              display: 'flex',
              padding: '0',
              background: isNightMode ? 'rgb(32, 32, 32)' : 'rgb(247, 247, 247)',
            }}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <form style={{ display: 'flex', margin: '15px 20px', width: '100%' }}>
                <ConfigProvider theme={{ algorithm: isNightMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
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
          <Content style={{ background: isNightMode ? 'rgb(32, 32, 32)' : 'rgb(243, 243, 243)', display: 'flex' }}>
            信息栏
          </Content>
        </Layout>
      </Sider>
      <Layout style={{ background: isNightMode ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
        <Header
          style={{
            background: isNightMode ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
            borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1',
          }}
        >
          用户名
        </Header>
        <Content
          style={{
            height: '100%',
            background: isNightMode ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
            borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1',
          }}
        >
          聊天框
        </Content>
        <Footer style={{ height: '200px', background: isNightMode ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
          输入框
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomePage;
