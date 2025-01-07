import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShopOutlined,
  ProfileOutlined,
  GiftOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './style.module.scss';

const BottomMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <ShopOutlined />,
      label: 'Shop',
      onClick: () => navigate('/'),
    },
    {
      icon: <ProfileOutlined />,
      label: 'Order',
      onClick: () => navigate('/order'),
    },
    {
      icon: <GiftOutlined />,
      label: 'Sell gift',
      onClick: () => navigate('/sell'),
    },
    {
      icon: <StarOutlined />,
      label: 'Soon',
      onClick: () => navigate('/soon'),
    },
    {
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
  ];

  return (
    <div className={styles.menuContainer}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.menuItem} onClick={item.onClick}>
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomMenu;
