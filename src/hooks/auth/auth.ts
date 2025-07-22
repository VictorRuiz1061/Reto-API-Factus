import { useState, useEffect } from 'react';
import { isAuthenticated as checkAuth } from '@/api/auth/auth';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
}

export const useGetAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated = checkAuth();
      setAuthState({
        isAuthenticated: authenticated,
        loading: false,
      });
    };

    checkAuthentication();
  }, []);

  return authState;
}; 