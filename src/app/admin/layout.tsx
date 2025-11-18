'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Sidebar, Footer } from '@/components/layout';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/hooks';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, _hasHydrated } = useAuth();
  const isAuthorized = _hasHydrated && isAuthenticated && isAdmin;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Cerrar sidebar automáticamente en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

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
      <div className="flex flex-1 relative min-h-screen">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-18 left-4 z-50 p-2.5 bg-dark-800 border border-dark-700 rounded-lg text-gray-300 hover:text-primary-400 hover:border-primary-400 transition-all shadow-lg"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-30 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
          <div className="p-4 sm:p-8 pt-20 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
