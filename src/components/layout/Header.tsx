/**
 * Header Component
 * Navigation bar with authentication state and role-based access
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User, Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    // Optionally redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.HOME;
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-dark-900/95 backdrop-blur supports-backdrop-filter:bg-dark-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-400">
              <span className="text-lg font-bold text-dark-900">B</span>
            </div>
            <span className="text-lg font-semibold text-gray-100">Bocado</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href={ROUTES.PRODUCTS} 
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                Productos
              </Link>
              <Link 
                href={ROUTES.ORDERS} 
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                Órdenes
              </Link>
              
              {/* Show admin link only for admin users */}
              {isAdmin && (
                <Link 
                  href={ROUTES.ADMIN_USERS} 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* TODO: Add cart functionality */}
            {/* {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary-400 text-dark-900 text-xs flex items-center justify-center font-semibold">
                  0
                </span>
              </Button>
            )} */}

            {isAuthenticated ? (
              <>
                <Link href={ROUTES.PROFILE}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.username ?? 'Usuario'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-primary-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            {/* Mobile Navigation Links */}
            {isAuthenticated && (
              <div className="flex flex-col gap-4 mb-4">
                <Link 
                  href={ROUTES.PRODUCTS}
                  className="text-gray-300 hover:text-primary-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link 
                  href={ROUTES.ORDERS}
                  className="text-gray-300 hover:text-primary-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Órdenes
                </Link>
                
                {isAdmin && (
                  <Link 
                    href={ROUTES.ADMIN_USERS}
                    className="text-gray-300 hover:text-primary-400 transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href={ROUTES.PROFILE} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      {user?.username ?? 'Usuario'}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href={ROUTES.SIGNUP} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
