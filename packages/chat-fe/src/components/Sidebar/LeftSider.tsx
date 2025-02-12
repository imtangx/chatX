import React from 'react';
import { Avatar, BubbleGrey, BubbleBlue, ContactsGrey, ContactsBlue, LogoutGrey } from '../../assets';
import { MenuItem } from '@chatx/types';

interface LeftSiderProps {
  activeItem: string;
  isDark: boolean;
  handleItemClick: (id: string) => void;
  handleLogout: () => void;
}

const MenuItems: MenuItem[] = [
  { id: 'chat', label: '聊天', icon: BubbleGrey, iconSelected: BubbleBlue },
  { id: 'contacts', label: '联系人', icon: ContactsGrey, iconSelected: ContactsBlue },
];

const LeftSider: React.FC<LeftSiderProps> = ({ activeItem, isDark, handleItemClick, handleLogout }) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 10px',
        background: isDark ? 'rgb(81, 81, 81)' : 'rgb(224, 224, 224)',
      }}
    >
      <div style={{ borderRadius: '50%', margin: '30px 0', overflow: 'hidden' }}>
        <img src={Avatar} alt='Avatar' style={{ width: '100%', height: '100%' }} />
      </div>

      {MenuItems.slice(0, 2).map(item => (
        <div
          key={item.id}
          onClick={() => {
            handleItemClick(item.id);
          }}
          style={{ cursor: 'pointer', margin: '15px 0', width: '80%' }}
        >
          <img
            src={activeItem === item.id ? item.iconSelected : item.icon}
            alt={item.label}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}

      {/** 填满中间空白区域 */}
      <div style={{ flexGrow: '1' }}></div>

      <div style={{ cursor: 'pointer', width: '80%', margin: '15px 0' }}>
        <img src={LogoutGrey} alt='Logout' style={{ width: '100%', height: '100%' }} onClick={handleLogout} />
      </div>
    </div>
  );
};

export default LeftSider;
