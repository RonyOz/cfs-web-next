'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/constants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log el error a un servicio de reporte de errores
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-warning-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-warning-500/10 border-2 border-warning-500/50 rounded-full p-6">
              <AlertTriangle className="h-20 w-20 text-warning-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Algo salió mal
        </h1>
        
        <p className="text-lg text-gray-400 mb-2">
          Ocurrió un error inesperado
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          No te preocupes, nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
        </p>

        {/* Error Details - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-dark-800 border border-warning-600/30 rounded-lg text-left">
            <p className="text-xs text-warning-500 font-medium mb-2">Detalles del Error:</p>
            <p className="text-xs text-gray-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Error Code */}
        <div className="inline-block px-4 py-2 bg-warning-500/10 border border-warning-500/30 rounded-lg mb-8">
          <span className="text-warning-500 font-mono text-sm font-medium">
            Error 500 - Internal Server Error
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Intentar de Nuevo
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
            Si el problema persiste, por favor contacta a soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}
