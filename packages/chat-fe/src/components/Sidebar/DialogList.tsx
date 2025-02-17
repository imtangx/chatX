import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useDialog } from '../../context/DialogContext';
import axios from 'axios';

interface Dialog {
  id: number;
  username: string;
  avatar: string;
  // lastMessage: string;
  // isOnline: boolean;
}

interface DialogListProps {
  isDark: boolean;
}

const DialogList: React.FC<DialogListProps> = ({ isDark }) => {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);

  useEffect(() => {
    const loadDialogs = async () => {
      const res = await axios.get(`http://localhost:3001/friends/${localStorage.getItem('userId')}`);
      setDialogs(res.data.friends);
    };
    loadDialogs();
  }, []);

  const { activeDialog, setActiveDialog } = useDialog();

  const handleDialogClick = (username: string) => {
    setActiveDialog(username);
  };

  return (
    <List
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      dataSource={dialogs}
      renderItem={dialog => (
        <List.Item
          key={dialog.id}
          style={{
            background:
              activeDialog === dialog.username ? (isDark ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)') : 'inherit',
            cursor: 'pointer',
          }}
          onClick={() => handleDialogClick(dialog.username)}
        >
          <Card style={{ width: '100%', margin: '0 16px', background: 'inherit' }}>
            <Card.Meta
              title={
                <div style={{ flexDirection: 'column' }}>
                  <div>
                    {dialog.username}
                    <Tag
                      style={{ marginLeft: '8px' }}
                      icon={true ? <CheckCircleFilled /> : <CloseCircleFilled />}
                      color={true ? 'green' : 'red'}
                    >
                      {true ? '在线' : '离线'}
                    </Tag>
                  </div>
                  <span style={{ fontSize: '10px', color: 'grey' }}>{dialog.lastMessage}</span>
                </div>
              }
              avatar={<Avatar src={dialog.avatar} />}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default DialogList;
