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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
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
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* TODO: Add admin actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Ejecutar Seed
          </button>
        </div>
      </div>
    </aside>
  );
};
