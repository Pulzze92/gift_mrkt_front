import axios from 'axios';

const BASE_URL = 'https://giftmarket-backend.unitaz.xyz';

interface ApiResponse<T> {
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

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getHeaders = (initData: string, referralLink: string | null = null) => ({
  'initdata': initData,
  'referral-link': referralLink,
});

export const validateUser = async (initData: string, referralLink: string | null = null): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/validate-user', null, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const getUserGifts = async (initData: string, referralLink: string | null = null): Promise<Gift[]> => {
  const response = await api.get<Gift[]>('/gifts', {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const getDetailGift = async (giftId: string, initData: string, referralLink: string | null = null): Promise<Gift> => {
  const response = await api.get<Gift>(`/gifts/${giftId}`, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const withdrawGift = async (
  giftId: string, 
  initData: string, 
  referralLink: string | null = null,
  username?: string
) => {
  const response = await api.post('/gifts/withdraw', {
    gift_id: giftId,
    username,
  }, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const getOrders = async (
  params: {
    page?: number;
    page_size?: number;
    collection_name?: string;
    order_by?: 'price_asc' | 'price_desc' | 'number_asc' | 'number_desc';
  },
  initData: string,
  referralLink: string | null = null
): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders', {
    params,
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const getUserOrders = async (initData: string, referralLink: string | null = null): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders/user', {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const createOrder = async (
  giftId: string,
  price: number,
  initData: string,
  referralLink: string | null = null,
  currency: 'usd' | 'ton' = 'ton'
): Promise<Order> => {
  const response = await api.post<Order>('/orders/create', {
    gift_id: giftId,
    price,
    currency,
  }, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const deactivateOrder = async (
  orderId: string,
  initData: string,
  referralLink: string | null = null
): Promise<Order> => {
  const response = await api.put<Order>('/orders/deactivate', {
    order_id: orderId,
  }, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};

export const generatePaymentUrl = async (
  orderId: string,
  initData: string,
  referralLink: string | null = null
): Promise<ApiResponse<PaymentInvoice>> => {
  const response = await api.post<ApiResponse<PaymentInvoice>>('/orders/payment', {
    order_id: orderId,
  }, {
    headers: getHeaders(initData, referralLink),
  });
  return response.data;
};
