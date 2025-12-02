import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Error response interface
interface ApiErrorResponse {
  error: string;
  code?: string;
  message?: string;
  details?: string[];
}

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: string[];

  constructor(message: string, status: number, code?: string, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle network errors
    if (!error.response) {
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    const { status, data } = error.response;
    const errorMessage = data?.error || data?.message || 'An error occurred';
    const errorCode = data?.code;
    const errorDetails = data?.details;

    // Handle 401 - Unauthorized
    if (status === 401) {
      // Clear token and redirect to login
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      
      // Only redirect if in browser and not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    throw new ApiError(errorMessage, status, errorCode, errorDetails);
  }
);

// Type-safe API methods
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

// ====================
// API Type Definitions
// ====================

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  balance?: number;
  createdAt?: string;
  isNewUser?: boolean;
}

export interface Subscription {
  id?: string;
  plan?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  message?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Server {
  id: string;
  name: string;
  location?: string;
  country?: string;
  load?: number;
  maxUsers?: number;
  currentUsers?: number;
  isActive: boolean;
}

export interface ServerConfig {
  id: string;
  serverId: string;
  serverName?: string;
  serverLocation?: string;
  serverCountry?: string;
  vlessConfig: string;
  qrCode?: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface CreatePaymentResponse {
  paymentId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
}

export interface PromoCodeResponse {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  valid: boolean;
}

// ====================
// API Functions
// ====================

export const authApi = {
  /**
   * Login with Telegram
   */
  async loginWithTelegram(data: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: string;
    hash: string;
    referralId?: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/telegram', data);
    
    // Store tokens
    Cookies.set('token', response.accessToken || response.token, { expires: 1 }); // 1 day for access token
    if (response.refreshToken) {
      Cookies.set('refreshToken', response.refreshToken, { expires: 7 }); // 7 days for refresh token
    }
    
    return response;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = Cookies.get('refreshToken');
    const telegramId = Cookies.get('telegramId');
    
    if (!refreshToken || !telegramId) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
    }
    
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
      telegramId,
    });
    
    Cookies.set('token', response.accessToken || response.token, { expires: 1 });
    if (response.refreshToken) {
      Cookies.set('refreshToken', response.refreshToken, { expires: 7 });
    }
    
    return response;
  },

  /**
   * Logout
   */
  logout(): void {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('telegramId');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

export const userApi = {
  /**
   * Get current user
   */
  async getUser(): Promise<User> {
    return apiClient.get<User>('/user');
  },

  /**
   * Get user subscription
   */
  async getSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>('/user/subscription');
  },

  /**
   * Get payment history
   */
  async getPayments(): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/user/payments');
  },

  /**
   * Get user's server configs
   */
  async getServers(): Promise<ServerConfig[]> {
    return apiClient.get<ServerConfig[]>('/user/servers');
  },
};

export const serverApi = {
  /**
   * Get all available servers
   */
  async getServers(): Promise<Server[]> {
    return apiClient.get<Server[]>('/servers');
  },

  /**
   * Get or create config for a server
   */
  async getServerConfig(serverId: string): Promise<ServerConfig> {
    return apiClient.get<ServerConfig>(`/servers/${serverId}/config`);
  },

  /**
   * Delete config for a server
   */
  async deleteServerConfig(serverId: string): Promise<void> {
    return apiClient.delete(`/servers/${serverId}/config`);
  },
};

export const billingApi = {
  /**
   * Create payment
   */
  async createPayment(params: {
    plan: string;
    devices?: number;
    promoCode?: string;
  }): Promise<CreatePaymentResponse> {
    return apiClient.post<CreatePaymentResponse>('/billing/create', params);
  },
};

export const promoApi = {
  /**
   * Apply promo code
   */
  async applyPromoCode(code: string): Promise<PromoCodeResponse> {
    return apiClient.post<PromoCodeResponse>('/promo/apply', { code });
  },
};

// Export default for backwards compatibility
export default api;
