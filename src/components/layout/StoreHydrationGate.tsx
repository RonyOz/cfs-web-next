'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks';

interface StoreHydrationGateProps {
  children: ReactNode;
}

export const StoreHydrationGate = ({ children }: StoreHydrationGateProps) => {
  const { _hasHydrated } = useAuth();

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-sm">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
