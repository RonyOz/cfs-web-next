'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Sidebar, Footer } from '@/components/layout';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/hooks';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, _hasHydrated } = useAuth();
  const isAuthorized = _hasHydrated && isAuthenticated && isAdmin;

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.AUTH);
      return;
    }

    if (!isAdmin) {
      router.replace('/unauthorized');
    }
  }, [_hasHydrated, isAuthenticated, isAdmin, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-gray-400 text-sm">Validando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <Footer />
    </>
  );
}
