import axios, { AxiosInstance } from 'axios';

export const telegramAuthHeader = window.Telegram?.WebApp?.initData || '';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${telegramAuthHeader}`,
    },
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('Received response:', error.response.data);
      }
      return Promise.reject(error);
    }
  );

  const Router = {
  };
  
  export default Router;