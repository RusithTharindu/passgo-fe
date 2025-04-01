'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenStorage } from '@/utils/helpers/cookieStorage';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isAuthenticated: boolean;
  checkAuthStatus: () => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check authentication status on mount and token changes
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const hasToken = tokenStorage.hasToken();
    setIsAuthenticated(hasToken);
    return hasToken;
  };

  const logout = () => {
    tokenStorage.removeToken();
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
