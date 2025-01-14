import { showGlobalToast } from '../context/ToastContext';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (message: string, type: ToastType = 'info') => {
  showGlobalToast(message, type);
}; 