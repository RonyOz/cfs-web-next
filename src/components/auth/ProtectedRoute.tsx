/**
 * TODO: Implement authentication check
 * TODO: Implement role-based access control
 * TODO: Redirect to login if not authenticated
 * TODO: Show loading state while checking auth
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { ROUTES, USER_ROLES } from '@/config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const router = useRouter();
  // Get auth state from hook
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page
      router.push(ROUTES.LOGIN);
      return;
    }

    // Check if admin access is required
    if (requireAdmin && !isAdmin) {
      // Redirect to home or show unauthorized message
      router.push(ROUTES.HOME);
      return;
    }
  }, [isAuthenticated, isAdmin, requireAdmin, router]);

  // TODO: Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // TODO: Show unauthorized message if admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
