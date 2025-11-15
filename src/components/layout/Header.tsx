'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User, Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth, useOrders } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useOrders();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-400 p-1.5">
              <img src="/logo.svg" alt="Bocado" className="h-full w-full" />
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
            {/* Shopping Cart */}
            {isAuthenticated && (
              <Link href={ROUTES.CART}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative",
                    cartItemCount > 0 && "text-primary-400"
                  )}
                  title="Ver carrito"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

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
                <Link href={ROUTES.AUTH}>
                  <Button variant="outline" size="sm" className="gap-2 border">
                    <User className="h-4 w-4" />
                    Iniciar Sesión
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
                  href={ROUTES.CART}
                  className="text-gray-300 hover:text-primary-400 transition-colors px-2 py-1 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Carrito
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
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
                  <Link href={ROUTES.AUTH} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Iniciar Sesión / Registrarse
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
