'use client';

import { useState, useCallback } from 'react';
import { getUserById, updateUser } from '@/lib/api/users';
import { UpdateUserInput, User } from '@/types';
import { useAuth } from './useAuth';

type ProfileData = User;

export const useMyProfile = () => {
  const { user, setUser, _hasHydrated } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(
    async (overrideId?: string) => {
      if (!_hasHydrated) return null;
      const targetId = overrideId ?? userId;
      if (!targetId) return null;

      setLoading(true);
      setError(null);
      try {
        const data = await getUserById(targetId);
        setProfile(data);
        if (!user || user.id === data.id) {
          setUser(data);
        }
        return data;
      } catch (err: any) {
        const message = err?.message || 'No se pudo cargar el perfil';
        if (user) {
          console.warn('[useMyProfile] Falling back to auth store user:', message);
          setProfile(user);
          setError(null);
          return user;
        }
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [_hasHydrated, userId, user, setUser]
  );

  const updateProfile = useCallback(
    async (payload: UpdateUserInput, overrideId?: string) => {
      const targetId = overrideId ?? userId;
      if (!targetId) {
        throw new Error('No hay usuario autenticado');
      }
      const updated = await updateUser(targetId, payload);
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      if (user && user.id === targetId) {
        setUser({ ...user, ...updated });
      }
      return updated;
    },
    [userId, user, setUser]
  );

  const stats = {
    products: profile?.products?.length ?? profile?.productsCount ?? 0,
    orders: profile?.orders?.length ?? 0,
  };

  return {
    profile,
    loading,
    error,
    stats,
    fetchUser,
    updateProfile,
  };
};
