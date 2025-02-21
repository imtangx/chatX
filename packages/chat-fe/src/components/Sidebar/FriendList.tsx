import React, { useEffect, useState } from 'react';
import { Avatar, List, Card, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { User } from '@chatx/types';

const FriendList = () => {
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      const res = await axios.get(`http://localhost:3001/friends`);
      setFriends(res.data.friends);
    };
    loadFriends();
  }, []);

  return (
    <List
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      dataSource={friends}
      renderItem={friend => (
        <List.Item key={friend.userId}>
          <Card hoverable style={{ width: '100%', margin: '0 16px' }}>
            <Card.Meta
              style={{ display: 'flex', alignItems: 'center' }}
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {friend.username}
                  <Tag
                    style={{ marginLeft: '8px' }}
                    icon={true ? <CheckCircleFilled /> : <CloseCircleFilled />}
                    color={true ? 'green' : 'red'}
                  >
                    {true ? '在线' : '离线'}
                  </Tag>
                </div>
              }
              avatar={<Avatar src={friend.avatar} />}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FriendList;
