import React from 'react';
import { Avatar, BubbleGrey, BubbleBlue, ContactsGrey, ContactsBlue, NightModeGrey, NightModeBlue } from '../../assets';
import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { MenuItem } from '@chatx/types';

interface LeftSiderProps {
  activeItem: string;
  isNightMode: boolean;
  handleItemClick: (id: string) => void;
  handleNightModeToggle: () => void;
  handleLogout: () => void;
}

const defaultMenuItems: MenuItem[] = [
  { id: 'chat', label: '聊天', icon: BubbleGrey, iconSelected: BubbleBlue },
  { id: 'contacts', label: '联系人', icon: ContactsGrey, iconSelected: ContactsBlue },
];

const LeftSider: React.FC<LeftSiderProps> = ({
  activeItem,
  isNightMode,
  handleItemClick,
  handleNightModeToggle,
  handleLogout,
}) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 10px',
        background: isNightMode ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)',
      }}
    >
      <div style={{ margin: '30px 0' }}>
        <img src={Avatar} alt='Avatar' style={{ width: '100%', height: '100%' }} />
      </div>

      <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ cursor: "pointer", float: 'right' }}>
        登出
      </Button>

      {defaultMenuItems.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item.id)} style={{ cursor: 'pointer', margin: '15px 2px' }}>
          <img
            src={activeItem === item.id ? item.iconSelected : item.icon}
            alt={item.label}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}

      <div style={{ marginBottom: '30px', marginTop: 'auto', cursor: 'pointer' }}>
        <img
          src={isNightMode ? NightModeBlue : NightModeGrey}
          alt='NightMode'
          style={{ width: '100%', height: '100%' }}
          onClick={handleNightModeToggle}
        />
      </div>
    </div>
  );
};

export default LeftSider;