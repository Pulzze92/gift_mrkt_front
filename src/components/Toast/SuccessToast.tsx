import React from 'react';
import styles from './style.module.scss';

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <div className={`${styles.toast} ${styles.success}`}>
      {message}
    </div>
  );
};

export default SuccessToast;
