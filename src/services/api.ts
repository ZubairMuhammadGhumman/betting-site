import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'https://beta.kazino55.net/api/v1';

// Create axios instance with better error handling
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add retry configuration
  validateStatus: (status) => status < 500, // Don't throw for 4xx errors
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
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network connection failed. Please check your internet connection.'));
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = response.data.data;
          TokenManager.setTokens(token, newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and redirect to login
          TokenManager.clearTokens();
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          window.location.reload();
        }
      } else {
        // No refresh token, clear everything
        TokenManager.clearTokens();
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
      }
    }

    // Handle other HTTP errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
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

// API Service Class with better error handling
export class ApiService {
  // Helper method for making safe API calls
  private static async safeApiCall<T>(apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
    try {
      const response = await apiCall();
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'API call failed');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Authentication Methods
  static async register(data: {
    email: string;
    password: string;
    nickname: string;
    agreeTerms: boolean;
    agreeMarketing?: boolean;
  }): Promise<AuthResponse> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data));
  }

  static async quickRegister(data: {
    agreeTerms: boolean;
  }): Promise<AuthResponse> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<AuthResponse>>('/auth/register/quick', data));
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data));
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Don't throw on logout errors, just log them
      console.warn('Logout API call failed:', error);
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken
    }));
  }

  // User Management Methods
  static async getProfile(): Promise<User> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<User>>('/users/profile'));
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    return this.safeApiCall(() => apiClient.put<ApiResponse<User>>('/users/profile', data));
  }

  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.safeApiCall(() => apiClient.put<ApiResponse<void>>('/users/password', data));
  }

  static async getBalance(): Promise<Balance> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<Balance>>('/users/balance'));
  }

  static async getStatistics(): Promise<any> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any>>('/users/statistics'));
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
    return this.safeApiCall(() => apiClient.post<ApiResponse<PaymentTransaction>>('/payments/deposit', data));
  }

  static async createWithdrawal(data: {
    amount: number;
    paymentMethod: string;
    cardNumber?: string;
    accountHolder?: string;
    wallet?: string;
  }): Promise<PaymentTransaction> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<PaymentTransaction>>('/payments/withdraw', data));
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
    return this.safeApiCall(() => apiClient.get<ApiResponse<{
      data: PaymentTransaction[];
      pagination: any;
    }>>('/payments/history', { params }));
  }

  static async getSavedCards(): Promise<any[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any[]>>('/payments/cards'));
  }

  static async deleteSavedCard(cardId: string): Promise<void> {
    await this.safeApiCall(() => apiClient.delete<ApiResponse<void>>(`/payments/cards/${cardId}`));
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
    return this.safeApiCall(() => apiClient.get<ApiResponse<{
      data: Game[];
      pagination: any;
    }>>('/games', { params }));
  }

  static async getFeaturedGames(): Promise<Game[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<Game[]>>('/games/featured'));
  }

  static async getPopularGames(): Promise<Game[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<Game[]>>('/games/popular'));
  }

  static async getGameCategories(): Promise<string[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<string[]>>('/games/categories'));
  }

  static async getGameDetails(gameId: string): Promise<Game> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<Game>>(`/games/${gameId}`));
  }

  static async launchGame(gameId: string, mode: 'real' | 'demo' = 'real'): Promise<{
    gameUrl: string;
    sessionId: string;
  }> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<{
      gameUrl: string;
      sessionId: string;
    }>>(`/games/${gameId}/launch`, { mode }));
  }

  // System Methods
  static async getRecentWinners(limit?: number): Promise<Winner[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<Winner[]>>('/winners/recent', {
      params: { limit }
    }));
  }

  static async getJackpots(): Promise<any[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any[]>>('/jackpots'));
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
    return this.safeApiCall(() => apiClient.get<ApiResponse<any>>('/config'));
  }

  static async healthCheck(): Promise<{
    status: string;
    timestamp: string;
  }> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any>>('/health'));
  }

  // Bonus Methods (Placeholders)
  static async getBonuses(): Promise<any[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any[]>>('/bonuses'));
  }

  static async claimBonus(bonusId: string): Promise<any> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<any>>(`/bonuses/${bonusId}/claim`));
  }

  static async getBonusHistory(): Promise<any[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any[]>>('/bonuses/history'));
  }

  // Support Methods (Placeholders)
  static async createSupportTicket(data: {
    subject: string;
    message: string;
    category?: string;
  }): Promise<any> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<any>>('/support/tickets', data));
  }

  static async getSupportTickets(): Promise<any[]> {
    return this.safeApiCall(() => apiClient.get<ApiResponse<any[]>>('/support/tickets'));
  }

  static async addTicketMessage(ticketId: string, message: string): Promise<any> {
    return this.safeApiCall(() => apiClient.post<ApiResponse<any>>(`/support/tickets/${ticketId}/messages`, {
      message
    }));
  }
}

// Enhanced token management with better error handling
export const TokenManager = {
  setTokens(token: string, refreshToken: string): void {
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  },

  getToken(): string | null {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  },

  clearTokens(): void {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.warn('Invalid token format:', error);
      return false;
    }
  }
};

export default ApiService;