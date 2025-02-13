import React from 'react';
import { Avatar, List, Card, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface Contact {
  id: string;
  name: string;
  avatarSrc: string;
  isOnline: boolean;
}

const ContactList = () => {
  const contacts: Contact[] = [
    { id: '1', name: '张三', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=1`, isOnline: true },
    { id: '2', name: '李四', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=2`, isOnline: false },
    { id: '3', name: '王五', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=3`, isOnline: true },
    { id: '4', name: '赵六', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=4`, isOnline: false },
    { id: '5', name: '钱七', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=5`, isOnline: true },
    { id: '6', name: '孙八', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=6`, isOnline: false },
    { id: '7', name: '周九', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=7`, isOnline: true },
    { id: '8', name: '吴十', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=8`, isOnline: false },
    { id: '9', name: '郑十一', avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=9`, isOnline: true },
  ];
  return (
    <List
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      header={<div style={{ fontWeight: 'bold', padding: '0 16px' }}>最近消息</div>}
      dataSource={contacts}
      renderItem={user => (
        <List.Item key={user.id}>
          <Card style={{ width: '100%', margin: '0 16px' }}>
            <Card.Meta
              title={
                <div>
                  {user.name}
                  <Tag
                    style={{ marginLeft: '8px' }}
                    icon={user.isOnline ? <CheckCircleFilled /> : <CloseCircleFilled />}
                    color={user.isOnline ? 'green' : 'red'}
                  >
                    {user.isOnline ? '在线' : '离线'}
                  </Tag>
                </div>
              }
              avatar={<Avatar src={user.avatarSrc} />}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ContactList;
