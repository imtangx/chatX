import React from 'react';
import { BubbleGrey, BubbleBlue, FriendsGrey, FriendsBlue, LogoutGrey } from '../../assets';
import { Avatar, Upload } from 'antd';
import { SiderItem } from '@chatx/types';
import { useUserStore } from '../../store/userStore';
import { useHomeStore } from '../../store/homeStore';
import { config } from '../../config';

interface LeftSiderProps {
  isDark: boolean;
  handleItemClick: (id: string) => void;
  handleLogout: () => void;
}

const MenuItems: SiderItem[] = [
  { id: 'chat', label: '聊天', icon: BubbleGrey, iconSelected: BubbleBlue },
  { id: 'friends', label: '朋友', icon: FriendsGrey, iconSelected: FriendsBlue },
];

const LeftSider: React.FC<LeftSiderProps> = ({ isDark, handleItemClick, handleLogout }) => {
  const { activeMenuItem } = useHomeStore();
  const { username, avatar, setAvatar } = useUserStore();
  const avatarUrl = avatar;
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
      <div style={{ width: '80%', margin: '15px 0' }}>
        <Upload
          action={`${config.API_URL}/upload/avatar/?username=${username}`}
          name='avatar'
          onChange={info => {
            if (info.file.status === 'done') {
              setAvatar(info.file.response.filename);
            }
          }}
          showUploadList={false}
          accept='image/*'
        >
          <Avatar src={avatarUrl} style={{ height: '100%', width: '100%' }} />
        </Upload>
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
            src={activeMenuItem === item.id ? item.iconSelected : item.icon}
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
