import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Tag } from 'antd';
import { useDialog } from '../../context/DialogContext';
import axios from 'axios';
import { Dialog } from '@chatx/types';

interface DialogListProps {
  isDark: boolean;
}

const DialogList: React.FC<DialogListProps> = ({ isDark }) => {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const { activeDialog, setActiveDialog } = useDialog();

  useEffect(() => {
    const loadDialogs = async () => {
      const res = await axios.get(`http://localhost:3001/friends/dialogs`);
      setDialogs(res.data.dialogs);
    };
    loadDialogs();
  }, []);

  const handleDialogClick = (username: string) => {
    setActiveDialog(username);
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    }
  };

  return (
    <List
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      dataSource={dialogs}
      renderItem={dialog => (
        <List.Item
          key={dialog.userId}
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{dialog.username}</span>
                    {dialog.lastMessageTime && (
                      <span style={{ fontSize: '12px', color: '#999' }}>{formatTime(dialog.lastMessageTime)}</span>
                    )}
                  </div>
                  {dialog.lastMessage && (
                    <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                      {dialog.lastMessage.length > 20 ? dialog.lastMessage.slice(0, 20) + '...' : dialog.lastMessage}
                    </div>
                  )}
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
