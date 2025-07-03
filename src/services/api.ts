import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'https://beta.kazino55.net/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: any;
  timestamp: string;
}

interface User {
  id: string;
  email: string;
  nickname: string;
  balance: number;
  level: number;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalDeposits?: number;
  totalWithdrawals?: number;
  totalWinnings?: number;
  gamesPlayed?: number;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  credentials?: {
    email: string;
    password: string;
  };
}

interface Game {
  id: string;
  name: string;
  category: string;
  provider: string;
  image: string;
  featured: boolean;
  jackpot?: number;
  rtp: number;
  isActive: boolean;
  createdAt: string;
}

interface Winner {
  id: string;
  username: string;
  game: string;
  amount: number;
  timestamp: string;
}

interface PaymentTransaction {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  paymentUrl?: string;
  wallet: string;
  createdAt: string;
}

interface Balance {
  wallet?: string;
  wallets?: Array<{
    wallet: string;
    balance: number;
    currency: string;
    lastUpdated: string;
  }>;
  balance?: number;
  totalBalance?: number;
  currency: string;
  lastUpdated: string;
}

// API Service Class
export class ApiService {
  // Authentication Methods
  static async register(data: {
    email: string;
    password: string;
    nickname: string;
    agreeTerms: boolean;
    agreeMarketing?: boolean;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  }

  static async quickRegister(data: {
    agreeTerms: boolean;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register/quick', data);
    return response.data.data;
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  }

  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken
    });
    return response.data.data;
  }

  // User Management Methods
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data.data;
  }

  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.put('/users/password', data);
  }

  static async getBalance(): Promise<Balance> {
    const response = await apiClient.get<ApiResponse<Balance>>('/users/balance');
    return response.data.data;
  }

  static async getStatistics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/users/statistics');
    return response.data.data;
  }

  // Payment Methods
  static async createDeposit(data: {
    amount: number;
    paymentMethod: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    saveCard?: boolean;
    wallet?: string;
  }): Promise<PaymentTransaction> {
    const response = await apiClient.post<ApiResponse<PaymentTransaction>>('/payments/deposit', data);
    return response.data.data;
  }

  static async createWithdrawal(data: {
    amount: number;
    paymentMethod: string;
    cardNumber?: string;
    accountHolder?: string;
    wallet?: string;
  }): Promise<PaymentTransaction> {
    const response = await apiClient.post<ApiResponse<PaymentTransaction>>('/payments/withdraw', data);
    return response.data.data;
  }

  static async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    type?: 'deposit' | 'withdrawal';
    status?: 'pending' | 'completed' | 'failed';
  }): Promise<{
    data: PaymentTransaction[];
    pagination: any;
  }> {
    const response = await apiClient.get<ApiResponse<{
      data: PaymentTransaction[];
      pagination: any;
    }>>('/payments/history', { params });
    return response.data.data;
  }

  static async getSavedCards(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/payments/cards');
    return response.data.data;
  }

  static async deleteSavedCard(cardId: string): Promise<void> {
    await apiClient.delete(`/payments/cards/${cardId}`);
  }

  // Games Methods
  static async getGames(params?: {
    category?: string;
    provider?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Game[];
    pagination: any;
  }> {
    const response = await apiClient.get<ApiResponse<{
      data: Game[];
      pagination: any;
    }>>('/games', { params });
    return response.data.data;
  }

  static async getFeaturedGames(): Promise<Game[]> {
    const response = await apiClient.get<ApiResponse<Game[]>>('/games/featured');
    return response.data.data;
  }

  static async getPopularGames(): Promise<Game[]> {
    const response = await apiClient.get<ApiResponse<Game[]>>('/games/popular');
    return response.data.data;
  }

  static async getGameCategories(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/games/categories');
    return response.data.data;
  }

  static async getGameDetails(gameId: string): Promise<Game> {
    const response = await apiClient.get<ApiResponse<Game>>(`/games/${gameId}`);
    return response.data.data;
  }

  static async launchGame(gameId: string, mode: 'real' | 'demo' = 'real'): Promise<{
    gameUrl: string;
    sessionId: string;
  }> {
    const response = await apiClient.post<ApiResponse<{
      gameUrl: string;
      sessionId: string;
    }>>(`/games/${gameId}/launch`, { mode });
    return response.data.data;
  }

  // System Methods
  static async getRecentWinners(limit?: number): Promise<Winner[]> {
    const response = await apiClient.get<ApiResponse<Winner[]>>('/winners/recent', {
      params: { limit }
    });
    return response.data.data;
  }

  static async getJackpots(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/jackpots');
    return response.data.data;
  }

  static async getConfig(): Promise<{
    currencies: string[];
    languages: string[];
    paymentMethods: any[];
    gameCategories: string[];
    maintenance: {
      isActive: boolean;
      message?: string;
      estimatedEnd?: string;
    };
    wallets: string[];
    features: {
      brombetWalletEnabled: boolean;
      aviatorEnabled: boolean;
      xliveEnabled: boolean;
    };
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/config');
    return response.data.data;
  }

  static async healthCheck(): Promise<{
    status: string;
    timestamp: string;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/health');
    return response.data.data;
  }

  // Bonus Methods (Placeholders)
  static async getBonuses(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/bonuses');
    return response.data.data;
  }

  static async claimBonus(bonusId: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/bonuses/${bonusId}/claim`);
    return response.data.data;
  }

  static async getBonusHistory(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/bonuses/history');
    return response.data.data;
  }

  // Support Methods (Placeholders)
  static async createSupportTicket(data: {
    subject: string;
    message: string;
    category?: string;
  }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/support/tickets', data);
    return response.data.data;
  }

  static async getSupportTickets(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/support/tickets');
    return response.data.data;
  }

  static async addTicketMessage(ticketId: string, message: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/support/tickets/${ticketId}/messages`, {
      message
    });
    return response.data.data;
  }
}

// Helper functions for token management
export const TokenManager = {
  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  clearTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default ApiService;