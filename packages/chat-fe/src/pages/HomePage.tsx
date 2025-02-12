import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Button, ConfigProvider, theme } from 'antd';
import { LeftSider } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

interface HomePageProps {
  isDark: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDark }) => {
  const [activeItem, setActiveItem] = useState<string>('chat');
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth/login');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width='5%' style={{ background: isDark ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)' }}>
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
          borderRight: '1px solid rgba(0, 0, 0, 0.1',
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
            信息栏
          </Content>
        </Layout>
      </Sider>
      <Layout style={{ background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
        <Header
          style={{
            background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
            borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1',
          }}
        >
          用户名
        </Header>
        <Content
          style={{
            height: '100%',
            background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
            borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1',
          }}
        >
          聊天框
        </Content>
        <Footer style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
          输入框
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HomePage;
