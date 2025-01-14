import React from 'react';
import styles from './style.module.scss';

interface ErrorToastProps {
  message: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  return (
    <div className={`${styles.toast} ${styles.error}`}>
      {message}
    </div>
  );
};

export default ErrorToast;
