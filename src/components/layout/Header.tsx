/**
 * TODO: Implement user menu dropdown
 * TODO: Add logout functionality
 * TODO: Show/hide admin links based on role
 * TODO: Add mobile responsive menu
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui';

export const Header = () => {
  // TODO: Get auth state from hook
  // const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // TODO: Implement logout handler
  const handleLogout = () => {
    // TODO: Call logout from auth store
    // TODO: Redirect to login page
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Campus Food Sharing
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* TODO: Show these links only when authenticated */}
            <Link href={ROUTES.PRODUCTS} className="text-gray-700 hover:text-primary-600">
              Productos
            </Link>
            <Link href={ROUTES.ORDERS} className="text-gray-700 hover:text-primary-600">
              Órdenes
            </Link>
            
            {/* TODO: Show this link only for admin users */}
            {/* {isAdmin && ( */}
              <Link href={ROUTES.ADMIN_USERS} className="text-gray-700 hover:text-primary-600">
                Admin
              </Link>
            {/* )} */}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* TODO: Show when authenticated */}
            {/* {isAuthenticated ? ( */}
              <>
                <Link href={ROUTES.PROFILE}>
                  <Button variant="outline" size="sm">
                    {/* {user?.username} */}
                    Usuario
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            {/* ) : ( */}
              {/* TODO: Show when not authenticated */}
              {/* <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </header>
  );
};
