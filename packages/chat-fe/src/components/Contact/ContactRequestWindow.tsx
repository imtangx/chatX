import React from 'react';
import { Layout, List, Card, Avatar, Tag, Input, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, SendOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;

interface ChatWindowProps {
  isDark: boolean;
}

interface ContactRequest {
  id: string;
  name: string;
  avatarSrc: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isDark }) => {
  const contactRequests: ContactRequest[] = [
    { id: '1', name: '张三', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=1` },
    { id: '2', name: '李四', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=2` },
    { id: '3', name: '王五', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=3` },
    { id: '4', name: '赵六', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=4` },
    { id: '5', name: '钱七', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=5` },
    { id: '6', name: '孙八', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=6` },
    { id: '7', name: '周九', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=7` },
    { id: '8', name: '吴十', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=8` },
    { id: '9', name: '郑十一', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=9` },
  ];

  const handleSendRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('^^');
  };

  return (
    <Layout style={{ background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
      <Header
        style={{
          background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
          borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1)',
          textAlign: 'left',
          fontSize: '15px',
          padding: '0 20px',
        }}
      >
        <h3 style={{ margin: 0 }}>新朋友</h3>
      </Header>
      <Content
        style={{
          height: '100%',
          background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)',
          borderBlockEnd: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <List
          grid={{ column: 3 }}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          dataSource={contactRequests}
          renderItem={user => (
            <List.Item key={user.id} style={{ display: 'flex', height: '100px', margin: '12px' }}>
              <Card style={{ height: '100%', width: '100%' }}>
                <Card.Meta
                  style={{ display: 'flex', alignItems: 'center' }}
                  avatar={<Avatar src={user.avatarSrc}></Avatar>}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {user.name}
                      <div style={{ flexGrow: 1 }}></div>
                      <Tag
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          console.log('agree');
                        }}
                        icon={<CheckCircleFilled></CheckCircleFilled>}
                        color='green'
                      >
                        同意
                      </Tag>
                      <Tag
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          console.log('refuse');
                        }}
                        icon={<CloseCircleFilled></CloseCircleFilled>}
                        color='red'
                      >
                        拒绝
                      </Tag>
                    </div>
                  }
                ></Card.Meta>
              </Card>
            </List.Item>
          )}
        ></List>
      </Content>
      <Footer style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
        <form style={{ display: 'flex' }} onSubmit={handleSendRequest}>
          <Input type='text' placeholder='输入对方账号' variant='filled'></Input>
          <Button type='primary' htmlType='submit' icon={<SendOutlined />} style={{ marginLeft: '5px' }}>
            发送好友请求
          </Button>
        </form>
      </Footer>
    </Layout>
  );
};

export default ChatWindow;
