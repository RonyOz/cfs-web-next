/**
 * Sidebar Component
 * Sidebar navigation for admin panel
 * - Admin-only component
 * - Show admin-specific navigation
 * 
 * TODO: Implement collapsible sidebar
 * TODO: Add icons for nav items
 * TODO: Add active link highlighting
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

interface SidebarLink {
  href: string;
  label: string;
  icon?: string; // TODO: Add Lucide icons
}

const adminLinks: SidebarLink[] = [
  { href: ROUTES.ADMIN_USERS, label: 'Usuarios' },
  { href: ROUTES.ADMIN_PRODUCTS, label: 'Productos' },
  { href: ROUTES.ADMIN_ORDERS, label: 'Órdenes' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-6">
          Panel de Administración
        </h2>

        <nav className="space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-gray-100'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
