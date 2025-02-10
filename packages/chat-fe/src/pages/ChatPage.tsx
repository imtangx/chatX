import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import AvatarJpg from '../assets/avatar.jpg';
import BubbleGreySvg from '../assets/bubble-grey.svg';
import BubbleBlueSvg from '../assets/bubble-blue.svg';
import PersonsGreySvg from '../assets/persons-grey.svg';
import PersonsBlueSvg from '../assets/persons-blue.svg';
import { Flex, Layout, Input, Button } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const ChatPage: React.FC = () => (
  <Layout style={{ height: '100vh' }}>
    <Sider width='5%' style={{ background: 'rgb(224, 224, 224)' }}>
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
        <div style={{ margin: '15px 5px' }}>
          <img src={BubbleGreySvg} alt='BubbleGreySvg' style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ margin: '15px 5px' }}>
          <img src={PersonsGreySvg} alt='PersonsGreySvg' style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </Sider>
    <Sider width='25%' style={{ background: 'rgb(247, 247, 247)', borderRight: '1px solid rgba(0, 0, 0, 0.1' }}>
      <Layout style={{ height: '100%' }}>
        <Header style={{ display: 'flex', padding: '0', background: 'rgb(247, 247, 247)' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <form style={{ display: 'flex', margin: '15px 20px', width: '100%' }}>
              <Input type='text' placeholder='搜索' variant='filled'></Input>
              <Button type='primary' htmlType='submit' icon={<SearchOutlined />} style={{ marginLeft: '5px' }}></Button>
            </form>
          </div>
        </Header>
        <Content style={{ background: 'rgb(243, 243, 243)', display: 'flex' }}>信息栏</Content>
      </Layout>
    </Sider>
    <Layout style={{ background: 'rgb(243, 243, 243)' }}>
      <Header style={{ background: 'rgb(243, 243, 243)', borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1' }}>
        用户名
      </Header>
      <Content
        style={{ height: '100%', background: 'rgb(243, 243, 243)', borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1' }}
      >
        聊天框
      </Content>
      <Footer style={{ height: '200px' }}>输入框</Footer>
    </Layout>
  </Layout>
);

export default ChatPage;
