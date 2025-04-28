 
/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, UserDetails } from '@/types/userTypes';

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      userDetails: null,
      isLoading: false,
      error: null,

      setUserDetails: (email: string) =>
        set(state => ({ userDetails: { ...state.userDetails, email } })),

      updateUserDetails: details =>
        set(state => ({
          userDetails: state.userDetails ? { ...state.userDetails, ...details } : null,
          error: null,
        })),

      clearUserDetails: () => set({ userDetails: null, isLoading: false, error: null }),
    }),
    {
      name: 'user-storage',
      partialize: state => ({
        userDetails: state.userDetails,
      }),
    },
  ),
);

// Selector hooks for better performance
export const useUserDetails = () => useUserStore(state => state.userDetails);
export const useUserEmail = () => useUserStore(state => state.userDetails?.email);
