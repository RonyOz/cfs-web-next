/**
 * TODO: Implement active link highlighting
 * TODO: Add breadcrumbs
 * TODO: Add search functionality
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: ROUTES.PRODUCTS, label: 'Productos' },
  { href: ROUTES.ORDERS, label: 'Mis Órdenes' },
  { href: ROUTES.PROFILE, label: 'Perfil' },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 h-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
