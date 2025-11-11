'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { TOKEN_KEY } from '@/config/constants';
import { logout as apiLogout } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
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
        // Store token in localStorage for API client access
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }

        // Update state with user and token
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: async () => {
        // Try to notify backend about logout (invalidate token) but don't block on failure
        try {
          await apiLogout();
        } catch (e) {
          // ignore network errors
        }

        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }

        // Reset state to initial values
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      setUser: (user: User) => {
        // Update user in state and recalculate isAdmin
        set({
          user,
          isAdmin: user.role === 'admin',
        });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and token, other values are derived
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
