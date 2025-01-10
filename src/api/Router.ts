import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://giftmarket-backend.unitaz.xyz';

// Types
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message: string;
}

export interface User {
  id: string;
  balance: string;
}

export interface Gift {
  id: string;
  owner_id: string;
  collection_name: string;
  collection_id: string;
  status: 'active' | 'withdrew';
  number: number;
  attributes: Record<string, string>;
  grade: string;
  message_id: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  price: number;
  status: 'created' | 'published' | 'success' | 'deactivated';
  created_at: string;
  updated_at: string;
  buyer_id: string | null;
  seller_id: string;
  gift_id: string;
}

export interface PaymentInvoice {
  amount: number;
  currency: string;
  url: string;
  payment_method: 'xrocket';
}

export const telegramAuthHeader = window.Telegram?.WebApp?.initData || '';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    initdata: telegramAuthHeader,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, Content-Type, Accept, Authorization, X-Request-With',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.method === 'options') {
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] =
        'GET, POST, PUT, DELETE, OPTIONS';
      config.headers['Access-Control-Allow-Headers'] =
        'Origin, Content-Type, Accept, Authorization, X-Request-With';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  async validateUser(referralLink: string | null = null) {
    const response = await apiClient.post<ApiResponse<User>>(
      '/validate-user',
      null,
      {
        headers: referralLink ? { 'referral-link': referralLink } : undefined,
      }
    );
    return response.data;
  },

  async getUserGifts(referralLink: string | null = null) {
    const response = await apiClient.get<Gift[]>('/gifts', {
      headers: referralLink ? { 'referral-link': referralLink } : undefined,
    });
    return response.data;
  },

  async getDetailGift(giftId: string, referralLink: string | null = null) {
    const response = await apiClient.get<Gift>(`/gifts/${giftId}`, {
      headers: referralLink ? { 'referral-link': referralLink } : undefined,
    });
    return response.data;
  },

  async withdrawGift(
    giftId: string,
    referralLink: string | null = null,
    username?: string
  ) {
    const response = await apiClient.post<ApiResponse<void>>(
      '/gifts/withdraw',
      {
        gift_id: giftId,
        username,
      },
      {
        headers: referralLink ? { 'referral-link': referralLink } : undefined,
      }
    );
    return response.data;
  },

  async getOrders(
    params: {
      page?: number;
      page_size?: number;
      collection_name?: string;
      order_by?: 'price_asc' | 'price_desc' | 'number_asc' | 'number_desc';
    },
    referralLink: string | null = null
  ) {
    const response = await apiClient.get<Order[]>('/orders', {
      params,
      headers: referralLink ? { 'referral-link': referralLink } : undefined,
    });
    return response.data;
  },

  async getUserOrders(referralLink: string | null = null) {
    const response = await apiClient.get<Order[]>('/orders/user', {
      headers: referralLink ? { 'referral-link': referralLink } : undefined,
    });
    return response.data;
  },

  async createOrder(
    giftId: string,
    price: number,
    referralLink: string | null = null,
    currency: 'usd' | 'ton' = 'ton'
  ) {
    const response = await apiClient.post<Order>(
      '/orders/create',
      {
        gift_id: giftId,
        price,
        currency,
      },
      {
        headers: referralLink ? { 'referral-link': referralLink } : undefined,
      }
    );
    return response.data;
  },

  async deactivateOrder(orderId: string, referralLink: string | null = null) {
    const response = await apiClient.put<Order>(
      '/orders/deactivate',
      {
        order_id: orderId,
      },
      {
        headers: referralLink ? { 'referral-link': referralLink } : undefined,
      }
    );
    return response.data;
  },

  async generatePaymentUrl(
    orderId: string,
    referralLink: string | null = null
  ) {
    const response = await apiClient.post<ApiResponse<PaymentInvoice>>(
      '/orders/payment',
      {
        order_id: orderId,
      },
      {
        headers: referralLink ? { 'referral-link': referralLink } : undefined,
      }
    );
    return response.data;
  },
};

export default Router;
