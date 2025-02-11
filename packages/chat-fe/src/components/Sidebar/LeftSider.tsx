import React from 'react';
import { Avatar, BubbleGrey, BubbleBlue, ContactsGrey, ContactsBlue, NightModeGrey, NightModeBlue } from '../../assets';
import { MenuItem } from '@chatx/types';

interface LeftSiderProps {
  /** storybook args配置 */
  primary?: boolean;
  label?: string;
  /** 当前选中的菜单项ID */
  activeItem: string;
  /** 夜间模式状态 */
  isNightMode: boolean;
  /** 菜单项点击回调 */
  handleItemClick: (id: string) => void;
  /** 夜间模式切换回调 */
  handleNightModeToggle: () => void;
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