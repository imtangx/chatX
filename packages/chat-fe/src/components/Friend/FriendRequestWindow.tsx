import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Avatar, Tag, Input, Button, Form } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, SendOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';

interface FriendRequestWindowProps {
  isDark: boolean;
}

interface FriendRequest {
  id: number;
  username: string;
  avatar: string;
  status: string;
}

const FriendRequestWindow: React.FC<FriendRequestWindowProps> = ({ isDark }) => {
  const [friendRequests, setFriendsRequests] = useState<FriendRequest[]>([]);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const loadFriendsRequest = async () => {
    const res = await axios.get(`http://localhost:3001/friends/requests`);
    setFriendsRequests(res.data.AllFriendRequests);
  };

  useEffect(() => {
    loadFriendsRequest();
  }, []);

  const handleSendFriendRequest = async () => {
    const receiverUsername = usernameInput;
    try {
      const res = await axios.post(`http://localhost:3001/friends/requests`, {
        receiverUsername: receiverUsername,
      });

      console.log('好友请求发送成功', res.data);
      setUsernameInput('');
    } catch (err) {
      console.error('发送好友请求失败', err);
    }
  };

  const handleAcceptRequest = async (reqId: number) => {
    console.log(reqId);
    try {
      const res = await axios.patch(`http://localhost:3001/friends/requests/${reqId}`, {
        newStatus: 'accepted',
      });
      loadFriendsRequest();
      console.log('请求状态更新成功', res.data);
    } catch (err) {
      console.error('请求状态更新失败', err);
    }
  };

  const handleRejectRequest = async (reqId: number) => {
    try {
      const res = await axios.patch(`http://localhost:3001/friends/requests/${reqId}`, {
        newStatus: 'rejected',
      });
      loadFriendsRequest();
      console.log('请求状态更新成功', res.data);
    } catch (err) {
      console.error('请求状态更新失败', err);
    }
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
          dataSource={friendRequests}
          renderItem={req => (
            <List.Item key={req.id} style={{ display: 'flex', height: '100px', margin: '12px' }}>
              <Card style={{ height: '100%', width: '100%' }}>
                <Card.Meta
                  style={{ display: 'flex', alignItems: 'center' }}
                  avatar={<Avatar src={req.avatar}></Avatar>}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {req.username}
                      <div style={{ flexGrow: 1 }}></div>

                      {req.status === 'pending' && (
                        <>
                          <Tag
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAcceptRequest(req.id)}
                            icon={<CheckCircleFilled></CheckCircleFilled>}
                            color='green'
                          >
                            同意
                          </Tag>
                          <Tag
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRejectRequest(req.id)}
                            icon={<CloseCircleFilled></CloseCircleFilled>}
                            color='red'
                          >
                            拒绝
                          </Tag>
                        </>
                      )}

                      {req.status === 'accepted' && <Tag icon={<CheckCircleFilled></CheckCircleFilled>}>已同意</Tag>}
                      {req.status === 'rejected' && <Tag icon={<CloseCircleFilled></CloseCircleFilled>}>已拒绝</Tag>}
                    </div>
                  }
                ></Card.Meta>
              </Card>
            </List.Item>
          )}
        ></List>
      </Content>
      <Footer style={{ height: '200px', background: isDark ? 'rgb(17, 17, 17)' : 'rgb(243, 243, 243)' }}>
        <Form style={{ display: 'flex' }} onFinish={handleSendFriendRequest}>
          <Form.Item name='username' rules={[{ required: true, message: '请输入！' }]} style={{ flexGrow: 1 }}>
            <Input
              type='text'
              placeholder='输入对方账号'
              variant='filled'
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
            ></Input>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' icon={<SendOutlined />} style={{ marginLeft: '5px' }}>
              发送好友请求
            </Button>
          </Form.Item>
        </Form>
      </Footer>
    </Layout>
  );
};

export default FriendRequestWindow;
