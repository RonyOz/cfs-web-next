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
import { Users, Package, ShoppingBag, LayoutDashboard } from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminLinks: SidebarLink[] = [
  { href: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.ADMIN_USERS, label: 'Usuarios', icon: Users },
  { href: ROUTES.ADMIN_PRODUCTS, label: 'Productos', icon: Package },
  { href: ROUTES.ADMIN_ORDERS, label: 'Órdenes', icon: ShoppingBag },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        'w-64 bg-dark-800 border-r border-dark-700 transition-transform duration-300 z-40 overflow-y-auto',
        'lg:translate-x-0 lg:static lg:min-h-screen',
        'fixed top-16 left-0 h-[calc(100vh-4rem)] bottom-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-6">
          Panel de Administración
        </h2>

        <nav className="space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
