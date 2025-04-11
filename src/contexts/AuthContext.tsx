'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { tokenStorage } from '@/utils/helpers/cookieStorage';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

type AuthContextType = {
  isAuthenticated: boolean;
  checkAuthStatus: () => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const { setUserFromToken, clearUser } = useAuthStore();

  const checkAuthStatus = useCallback(() => {
    const hasToken = tokenStorage.hasToken();
    setIsAuthenticated(hasToken);
    return hasToken;
  }, []);

  // Check authentication status on mount and token changes
  useEffect(() => {
    const hasToken = checkAuthStatus();
    if (hasToken) {
      setUserFromToken();
    }
  }, [checkAuthStatus, setUserFromToken]);

  const logout = () => {
    tokenStorage.removeToken();
    clearUser();
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
