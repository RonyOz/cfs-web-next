'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/constants';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-primary-500/10 border-2 border-primary-500/50 rounded-full p-6">
              <FileQuestion className="h-20 w-20 text-primary-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-gray-100 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Página No Encontrada
        </h2>
        
        <p className="text-lg text-gray-400 mb-2">
          Lo sentimos, no pudimos encontrar la página que buscas
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          La página puede haber sido movida, eliminada o el enlace puede ser incorrecto.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
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

        {/* Quick Links */}
        <div className="p-4 bg-dark-800 border border-dark-700 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Search className="h-4 w-4" />
            <span className="text-sm font-medium">Enlaces Rápidos</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href={ROUTES.PRODUCTS}>
              <span className="text-xs px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-primary-400 rounded-lg transition-colors cursor-pointer">
                Productos
              </span>
            </Link>
            <Link href={ROUTES.ORDERS}>
              <span className="text-xs px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-primary-400 rounded-lg transition-colors cursor-pointer">
                Mis Órdenes
              </span>
            </Link>
            <Link href={ROUTES.PROFILE}>
              <span className="text-xs px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-primary-400 rounded-lg transition-colors cursor-pointer">
                Perfil
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
