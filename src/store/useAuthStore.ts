import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decode, JwtPayload } from 'jsonwebtoken';
import { tokenStorage } from '@/utils/helpers/cookieStorage';

interface User {
  id: string;
  role: 'admin' | 'applicant';
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setUserFromToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
      setUserFromToken: () => {
        const token = tokenStorage.getToken();
        if (token) {
          const decodedToken = decode(token) as JwtPayload;
          if (decodedToken) {
            set({
              user: {
                id: decodedToken.uid as string,
                role: decodedToken.role as 'admin' | 'applicant',
              },
            });
          }
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: state => ({ user: state.user }), // only persist user data
    },
  ),
);

// Selector hooks for better performance
export const useUser = () => useAuthStore(state => state.user);
export const useUserRole = () => useAuthStore(state => state.user?.role);
export const useUserId = () => useAuthStore(state => state.user?.id);
