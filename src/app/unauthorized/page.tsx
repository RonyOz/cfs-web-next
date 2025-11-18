'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/hooks';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuth();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (_hasHydrated && !isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [_hasHydrated, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-danger-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-danger-500/10 border-2 border-danger-500/50 rounded-full p-6">
              <ShieldAlert className="h-20 w-20 text-danger-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Acceso Denegado
        </h1>
        
        <p className="text-lg text-gray-400 mb-2">
          No tienes permisos para acceder a esta página
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Esta área está restringida solo para administradores del sistema.
        </p>

        {/* Error Code */}
        <div className="inline-block px-4 py-2 bg-danger-500/10 border border-danger-500/30 rounded-lg mb-8">
          <span className="text-danger-500 font-mono text-sm font-medium">
            Error 403 - Forbidden
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver Atrás
          </Button>
          
          <Link href={ROUTES.HOME}>
            <Button variant="primary" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Ir al Inicio
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-4 bg-dark-800 border border-dark-700 rounded-lg">
          <p className="text-xs text-gray-500">
            Si crees que deberías tener acceso a esta página, por favor contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
