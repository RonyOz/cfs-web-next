/**
 * Authentication Store
 * Zustand store for managing authentication state
 * 
 * Academic Requirement: State Management (10%)
 * - Centralized authentication state
 * - JWT token management
 * - User role management
 * 
 * TODO: Implement all store actions
 * TODO: Add persistence (localStorage)
 * TODO: Add token refresh logic
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { TOKEN_KEY, USER_KEY } from '@/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      // Actions
      login: (user: User, token: string) => {
        // TODO: Implement login action
        // Store token in localStorage
        // Update state with user and token
        // Set isAuthenticated to true
        // Set isAdmin based on user role
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: () => {
        // TODO: Implement logout action
        // Clear token from localStorage
        // Reset state to initial values
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      setUser: (user: User) => {
        // TODO: Update user in state
        set({
          user,
          isAdmin: user.role === 'admin',
        });
      },

      setToken: (token: string) => {
        // TODO: Update token in state
        set({ token });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      // TODO: Add custom storage configuration
      // partialize: (state) => ({
      //   user: state.user,
      //   token: state.token,
      // }),
    }
  )
);
