import axios, { AxiosInstance } from 'axios';

export const BASE_URL = import.meta.env.DEV ? '/api' : 'https://giftmarket-backend.unitaz.xyz';

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
  name: string;
  price: number;
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
  price: number;
  status: 'created' | 'published' | 'success' | 'deactivated';
  created_at: string;
  updated_at: string;
  buyer_id: string | null;
  seller_id: string;
  gift_id: number;
  gift: Gift;
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
    'initdata': telegramAuthHeader,
  },
});

const Router = {
  async validateUser(referralLink: string | null = null) {
    const response = await apiClient.post<ApiResponse<User>>('/validate-user', null, {
      headers: referralLink ? { 'referral-link': referralLink } : undefined,
    });
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
          'Accept': 'application/json',
          'initdata': window.Telegram?.WebApp?.initData || '',
          ...(referralLink ? { 'referral-link': referralLink } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get gift details for ID ${giftId}:`, error);
      throw error;
    }
  },

  async withdrawGift(
    giftId: string,
    referralLink: string | null = null,
    username?: string
  ): Promise<{
    ok: boolean;
    message: string;
    invoice?: {
      amount: number;
      currency: string;
      url: string;
      payment_method: string;
    };
  }> {
    try {
      const response = await apiClient.post(
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return {
          ok: false,
          message: error.response.data.message || 'Failed to withdraw gift',
          invoice: error.response.data.invoice
        };
      }
      throw error;
    }
  },

  async getOrders(
    params: {
      page?: number;
      page_size?: number;
      collection_name?: string;
      order_by?: 'price_asc' | 'price_desc' | 'number_asc' | 'number_desc';
    } = {},
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

  async withdrawBalance(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; message: string }>(
        '/withdraw-balance'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.detail || 'Failed to withdraw balance'
        };
      }
      return {
        success: false,
        message: 'Failed to withdraw balance'
      };
    }
  },

  async withdrawGiftBalance(
    giftId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/gifts/withdraw',
        {
          gift_id: giftId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to withdraw balance');
      }
      throw error;
    }
  },
};

export default Router;
