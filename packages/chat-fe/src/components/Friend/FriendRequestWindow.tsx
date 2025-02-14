import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Avatar, Tag, Input, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, SendOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';

interface FriendRequestProps {
  isDark: boolean;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
  status: string;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ isDark }) => {
  const [friendRequests, setFriendsRequests] = useState<FriendRequest[]>([]);
  const loadFriendsRequest = async () => {
    const res = await axios.get(`http://localhost:3001/friends/requests/${localStorage.getItem('userId')}`);
    setFriendsRequests(res.data.result);
  };

  useEffect(() => {
    loadFriendsRequest();
  }, []);

  const handleSendRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('^^');
  };

  const handleAcceptRequest = async (reqId: string) => {
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

  const handleRejectRequest = async (reqId: string) => {
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

export default FriendRequest;
