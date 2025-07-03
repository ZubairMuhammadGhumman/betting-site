import { useState, useEffect } from 'react';
import ApiService, { TokenManager } from '../services/api';

// Custom hook for API calls with loading and error states
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  requireAuth: boolean = false
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Skip API call if authentication is required but user is not authenticated
      if (requireAuth && !TokenManager.isAuthenticated()) {
        if (isMounted) {
          setData(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    if (requireAuth && !TokenManager.isAuthenticated()) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for games with filtering (public endpoint)
export function useGames(filters?: {
  category?: string;
  provider?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(
    () => ApiService.getGames(filters),
    [JSON.stringify(filters)],
    false // Public endpoint
  );
}

// Hook for featured games (public endpoint)
export function useFeaturedGames() {
  return useApi(
    () => ApiService.getFeaturedGames(),
    [],
    false // Public endpoint
  );
}

// Hook for recent winners (public endpoint)
export function useRecentWinners(limit?: number) {
  return useApi(
    () => ApiService.getRecentWinners(limit),
    [limit],
    false // Public endpoint
  );
}

// Hook for user balance (requires authentication)
export function useBalance() {
  return useApi(
    () => ApiService.getBalance(),
    [],
    true // Requires authentication
  );
}

// Hook for user profile (requires authentication)
export function useProfile() {
  return useApi(
    () => ApiService.getProfile(),
    [],
    true // Requires authentication
  );
}

// Hook for payment history (requires authentication)
export function usePaymentHistory(params?: {
  page?: number;
  limit?: number;
  type?: 'deposit' | 'withdrawal';
  status?: 'pending' | 'completed' | 'failed';
}) {
  return useApi(
    () => ApiService.getPaymentHistory(params),
    [JSON.stringify(params)],
    true // Requires authentication
  );
}

// Hook for system config (public endpoint)
export function useConfig() {
  return useApi(
    () => ApiService.getConfig(),
    [],
    false // Public endpoint
  );
}

export default useApi;