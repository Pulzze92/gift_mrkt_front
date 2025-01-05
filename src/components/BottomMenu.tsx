import React from 'react';
import { ShopOutlined, ProfileOutlined, GiftOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const BottomMenu: React.FC = () => {
  const menuItems = [
    {
      icon: <ShopOutlined />,
      label: 'Shop',
    },
    {
      icon: <ProfileOutlined />,
      label: 'Order',
    },
    {
      icon: <GiftOutlined />,
      label: 'Sell gift',
    },
    {
      icon: <StarOutlined />,
      label: 'Soon',
    },
    {
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  return (
    <div className={styles.menuContainer}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.menuItem}>
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomMenu;
