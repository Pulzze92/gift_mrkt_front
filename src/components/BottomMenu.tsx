import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const menuItems = [
    {
      icon: <ShopOutlined />,
      label: 'Market',
      path: '/shop',
      onClick: () => navigate('/shop'),
    },
    {
      icon: <ProfileOutlined />,
      label: 'My Orders',
      path: '/orders',
      onClick: () => navigate('/orders'),
    },
    {
      icon: <GiftOutlined />,
      label: 'Sell gift',
      path: '/sell',
      onClick: () => navigate('/sell'),
    },
    // {
    //   icon: <StarOutlined />,
    //   label: 'Soon',
    //   path: '/soon',
    //   onClick: () => navigate('/soon'),
    // },
    {
      icon: <UserOutlined />,
      label: 'Profile',
      path: '/profile',
      onClick: () => navigate('/profile'),
    },
  ];

  // Проверяем, находимся ли мы на главной странице
  const isActive = (path: string) => {
    if (path === '/shop') {
      return location.pathname === '/shop' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <div className={styles.menuContainer}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`${styles.menuItem} ${
            isActive(item.path) ? styles.active : ''
          }`}
          onClick={item.onClick}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomMenu;
