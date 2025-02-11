import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import AvatarJpg from '../assets/avatar.jpg';
import BubbleGreySvg from '../assets/bubble-grey.svg';
import BubbleBlueSvg from '../assets/bubble-blue.svg';
import ContactsGreySvg from '../assets/contacts-grey.svg';
import ContactsBlueSvg from '../assets/contacts-blue.svg';
import NightModeGreySvg from '../assets/nightMode-grey.svg';
import NightModeBlueSvg from '../assets/nightMode-blue.svg';
import { MenuItem } from '@chatx/types';
import { Flex, Layout, Input, Button, ConfigProvider, theme } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const ChatPage: React.FC = () => {
  const menuItems: MenuItem[] = [
    { id: 'chat', label: '聊天', icon: BubbleGreySvg, iconSelected: BubbleBlueSvg },
    { id: 'contacts', label: '联系人', icon: ContactsGreySvg, iconSelected: ContactsBlueSvg },
  ];

  const [activeItem, setActiveItem] = useState<string>('chat');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width='5%' style={{ background: isNightMode ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 10px',
          }}
        >
          <div style={{ margin: '30px 0' }}>
            <img src={AvatarJpg} alt='AvatarJpg' style={{ width: '100%', height: '100%' }} />
          </div>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: 'pointer', margin: '15px 2px' }}
            >
              <img
                src={activeItem === item.id ? item.iconSelected : item.icon}
                alt={item.label}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '30px', marginTop: 'auto', cursor: 'pointer' }}>
            <img
              src={isNightMode ? NightModeBlueSvg : NightModeGreySvg}
              alt='NightMode'
              style={{ width: '100%', height: '100%' }}
              onClick={() => setIsNightMode(!isNightMode)}
            />
          </div>
        </div>
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

export default ChatPage;
