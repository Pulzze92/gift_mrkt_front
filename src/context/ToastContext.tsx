import React, { createContext, useContext, useState } from 'react';
import SuccessToast from '../components/Toast/SuccessToast';
import ErrorToast from '../components/Toast/ErrorToast';
import styles from '../components/Toast/style.module.scss';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalShowToast: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  globalShowToast = showToast;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast?.show && (
        <div className={styles.toastContainer}>
          {toast.type === 'success' && <SuccessToast message={toast.message} />}
          {toast.type === 'error' && <ErrorToast message={toast.message} />}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const showGlobalToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (globalShowToast) {
    globalShowToast(message, type);
  }
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 