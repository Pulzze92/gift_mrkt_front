import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const LoadingOverlay: React.FC = () => {
  return (
    <div className={styles.loadingOverlay}>
      <LoadingOutlined className={styles.spinner} />
    </div>
  );
};

export default LoadingOverlay; 