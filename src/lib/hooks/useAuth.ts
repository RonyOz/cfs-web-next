/**
 * Authentication Hook
 * Custom hook for accessing auth state and actions
 * 
 * TODO: Implement hook logic using Zustand store
 */

'use client';

import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  // TODO: Implement useAuth hook
  // Get state and actions from Zustand store
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    setUser,
  };
};
