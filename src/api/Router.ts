import axios, { AxiosInstance } from 'axios';
import { showToast } from '../utils/toast';

export const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://giftmarket-backend.unitaz.xyz';

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
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
  name: string;
  price?: number;
  attributes: {
    model?: {
      rarity: number;
      sticker_url: string;
    };
    backdrop?: {
      rarity: number;
      center_color: number;
      edge_color: number;
    };
    symbol?: {
      rarity: number;
      sticker_url: string;
    };
  };
  grade: string;
  message_id: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  price: string;
  currency: string;
  currency_symbol?: string;
  status: 'created' | 'published' | 'success' | 'deactivated';
  created_at: string;
  updated_at: string;
  buyer_id: string | null;
  seller_id: string;
  gift_id: number;
  gift: Gift;
}

export interface PaymentInvoice {
  ok: boolean;
  invoice: {
    amount: number;
    currency: string;
    url: string;
    payment_method: string;
  };
  message: string;
}

export interface Currency {
  currency_symbol: string;
  currency_id: string;
  min_amount_processing: number;
}

export const telegramAuthHeader = window.Telegram?.WebApp?.initData || '';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    initdata: window.Telegram?.WebApp?.initData || '',
  },
});

interface ReferralResponse {
  ok: boolean;
  data: {
    miniapp_url: string;
    bot_url: string;
  };
}

interface SupportRequest {
  message: string;
}

interface OrdersParams {
  page?: number;
  page_size?: number;
  price_from?: number;
  price_to?: number;
  order_by?: string;
  collection_name?: string;
  currencies?: string[];
}

interface RouterInterface {
  validateUser: (referralLink?: string | null) => Promise<ApiResponse<User>>;
  getUserGifts: (referralLink?: string | null) => Promise<Gift[]>;
  getDetailGift: (giftId: string, referralLink?: string | null) => Promise<Gift>;
  withdrawGift: (giftId: string) => Promise<any>;
  getOrder: (orderId: string) => Promise<Order>;
  getOrders: (params?: OrdersParams) => Promise<Order[]>;
  getUserOrders: (params?: OrdersParams) => Promise<Order[]>;
  createOrder: (
    giftId: string,
    price: number,
    currency_id: string,
    referralLink?: string | null
  ) => Promise<Order>;
  deactivateOrder: (orderId: string, referralLink?: string | null) => Promise<Order>;
  generatePaymentUrl: (
    orderId: string,
    referralLink?: string | null
  ) => Promise<ApiResponse<PaymentInvoice>>;
  withdrawBalance: () => Promise<{ success: boolean; message: string }>;
  withdrawGiftBalance: (giftId: string) => Promise<{ success: boolean; message: string }>;
  getGifts: (referralLink?: string | null) => Promise<Gift[]>;
  getReferralInfo: () => Promise<ReferralResponse>;
  getGiftsToSell: () => Promise<Gift[]>;
  supportRequest: (data: SupportRequest) => Promise<any>;
  getCurrencies: () => Promise<Currency[]>;
}

const buildSearchParams = (params?: OrdersParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params?.price_from) searchParams.append('price_from', params.price_from.toString());
  if (params?.price_to) searchParams.append('price_to', params.price_to.toString());
  if (params?.order_by) searchParams.append('order_by', params.order_by);
  if (params?.collection_name) searchParams.append('collection_name', params.collection_name);
  
  if (params?.currencies?.length) {
    params.currencies.forEach(currency => {
      searchParams.append('currencies', currency);
    });
  }

  return searchParams.toString();
};

const Router: RouterInterface = {
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
    try {
      const response = await apiClient.get<Gift>(`/gifts/${giftId}`, {
        headers: {
          Accept: 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
          ...(referralLink ? { 'referral-link': referralLink } : {}),
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get gift details for ID ${giftId}:`, error);
      throw error;
    }
  },

  async withdrawGift(giftId: string) {
    try {
      const response = await apiClient.post<any>(`/gifts/withdraw`, {
        gift_id: giftId,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to withdraw gift';
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  async getOrder(orderId: string) {
    try {
      const response = await apiClient.get<Order>(`/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get order details for ID ${orderId}:`, error);
      throw error;
    }
  },

  async getOrders(params?: OrdersParams) {
    try {
      const response = await apiClient.get<Order[]>(`/orders?${buildSearchParams(params)}`, {
        headers: {
          'Content-Type': 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to fetch orders');
      }
      throw error;
    }
  },

  async getUserOrders(params?: OrdersParams) {
    try {
      const response = await apiClient.get<Order[]>(`/orders/user?${buildSearchParams(params)}`, {
        headers: {
          'Content-Type': 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  },

  async createOrder(
    giftId: string,
    price: number,
    currency_id: string,
    referralLink: string | null = null
  ) {
    try {
      const response = await apiClient.post<Order>(
        '/orders/create',
        {
          gift_id: giftId,
          price,
          currency_id
        },
        {
          headers: referralLink ? { 'referral-link': referralLink } : undefined,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to create order');
      }
      throw error;
    }
  },

  async deactivateOrder(orderId: string, referralLink: string | null = null) {
    try {
      const response = await apiClient.put<Order>(
        '/orders/deactivate',
        {
          order_id: orderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            initdata: window.Telegram?.WebApp?.initData || '',
            ...(referralLink ? { 'referral-link': referralLink } : {}),
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.detail || 'Failed to deactivate order'
        );
      }
      throw error;
    }
  },

  async generatePaymentUrl(
    orderId: string,
    referralLink: string | null = null
  ) {
    try {
      const response = await apiClient.post<ApiResponse<PaymentInvoice>>(
        '/orders/payment',
        {
          order_id: orderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            initdata: window.Telegram?.WebApp?.initData || '',
            ...(referralLink ? { 'referral-link': referralLink } : {}),
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.detail || 'Failed to generate payment URL'
        );
      }
      throw error;
    }
  },

  async withdrawBalance(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
      }>('/withdraw-balance');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.detail || 'Failed to withdraw balance',
        };
      }
      return {
        success: false,
        message: 'Failed to withdraw balance',
      };
    }
  },

  async withdrawGiftBalance(
    giftId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(
        '/gifts/withdraw',
        {
          gift_id: giftId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to withdraw balance'
        );
      }
      throw error;
    }
  },

  async getGifts(referralLink: string | null = null) {
    try {
      const response = await apiClient.get<Gift[]>('/gifts', {
        headers: {
          'Content-Type': 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
          ...(referralLink ? { 'referral-link': referralLink } : {}),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifts:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to fetch gifts');
      }
      throw error;
    }
  },

  async getReferralInfo(): Promise<ReferralResponse> {
    try {
      const response = await apiClient.post<ReferralResponse>(
        '/referral/get-info',
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            initdata: window.Telegram?.WebApp?.initData || '',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.detail || 'Failed to get referral info'
        );
      }
      throw error;
    }
  },

  async getGiftsToSell() {
    try {
      const response = await apiClient.get<Gift[]>('/gifts/to-sell', {
        headers: {
          'Content-Type': 'application/json',
          initdata: window.Telegram?.WebApp?.initData || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifts to sell:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to fetch gifts to sell');
      }
      throw error;
    }
  },

  async supportRequest(data: SupportRequest) {
    try {
      const response = await apiClient.post('/support-request', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to send support request');
      }
      throw error;
    }
  },

  async getCurrencies() {
    try {
      const response = await apiClient.get<Currency[]>('/currencies');
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || 'Failed to fetch currencies');
      }
      throw error;
    }
  },
};

export default Router;
