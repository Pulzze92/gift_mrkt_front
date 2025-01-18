import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './style.module.scss';

import success from '../../assets/success_toast.png';
import close from '../../assets/closeIcon.svg';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`${styles.toast} ${isSuccess ? styles.success : styles.error}`}
    >
      <div className={styles.icon}>
        {isSuccess ? (
          <img className={styles.checkIcon} src={success} alt="success icon" />
        ) : (
          <img className={styles.errorIcon} src={close} alt="unsuccess icon" />
        )}
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={() => toast.dismiss()}>
        <img className={styles.closeIcon} src={close} alt="close icon" />
      </button>
    </div>
  );
};

export default Toast;
