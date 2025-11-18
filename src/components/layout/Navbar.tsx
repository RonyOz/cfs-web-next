'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/hooks';

interface NavLink {
  href: string;
  label: string;
  requireAuth?: boolean;
}

const navLinks: NavLink[] = [
  { href: ROUTES.PRODUCTS, label: 'Productos' },
  { href: ROUTES.ORDERS, label: 'Mis Órdenes', requireAuth: true },
  { href: ROUTES.PROFILE, label: 'Perfil', requireAuth: true },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const visibleLinks = navLinks.filter(link => !link.requireAuth || isAuthenticated);

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all',
                    isActive
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-gray-300 hover:border-primary-500/50 hover:text-primary-400'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
