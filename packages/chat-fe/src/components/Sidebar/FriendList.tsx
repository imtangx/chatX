import React, { useEffect, useState } from 'react';
import { Avatar, List, Card, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';

interface Friend {
  id: string;
  username: string,
  avatar: string,
  // isOnline: boolean;
}

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      const res = await axios.get(`http://localhost:3001/friends/${localStorage.getItem('userId')}`);
      setFriends(res.data.friends);
    };
    loadFriends();
  }, []);

  return (
    <List
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      dataSource={friends}
      renderItem={user => (
        <List.Item key={user.id}>
          <Card hoverable style={{ width: '100%', margin: '0 16px' }}>
            <Card.Meta
              style={{ display: 'flex', alignItems: 'center' }}
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {user.username}
                  <Tag
                    style={{ marginLeft: '8px' }}
                    icon={true ? <CheckCircleFilled /> : <CloseCircleFilled />}
                    color={true ? 'green' : 'red'}
                  >
                    {true ? '在线' : '离线'}
                  </Tag>
                </div>
              }
              avatar={<Avatar src={user.avatar} />}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FriendList;
