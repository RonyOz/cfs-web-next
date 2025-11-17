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
  _hasHydrated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      _hasHydrated: false,

      // Actions
      login: (user: User, token: string) => {
        console.log('🔐 [AuthStore] Login called with:', { user, token: token.substring(0, 20) + '...' });
        console.log('🔐 [AuthStore] User role:', user.role);
        console.log('🔐 [AuthStore] isAdmin will be:', user.role === 'admin');
        
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
        
        console.log('🔐 [AuthStore] State after login:', get());
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

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and token, other values are derived
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      // Recalculate isAuthenticated and isAdmin when hydrating from storage
      onRehydrateStorage: () => {
        console.log('💧 [AuthStore] onRehydrateStorage - Starting hydration');
        return (state) => {
          console.log('💧 [AuthStore] State from storage:', state);
          if (state && state.user && state.token) {
            console.log('💧 [AuthStore] User found in storage:', state.user);
            console.log('💧 [AuthStore] User role:', state.user.role);
            state.isAuthenticated = true;
            state.isAdmin = state.user.role === 'admin';
            state._hasHydrated = true;
            console.log('💧 [AuthStore] After hydration - isAuthenticated:', state.isAuthenticated);
            console.log('💧 [AuthStore] After hydration - isAdmin:', state.isAdmin);
          } else {
            console.log('💧 [AuthStore] No valid user/token in storage');
            state._hasHydrated = true;
          }
        };
      },
    }
  )
);
