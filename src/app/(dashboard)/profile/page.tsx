'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { formatDateTime } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Mi Perfil</h1>
        <p className="mt-1 text-gray-400">Administra tu información personal</p>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary-400 flex items-center justify-center">
                <User className="h-10 w-10 text-dark-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100">{user.username}</h2>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-primary-400/20 text-primary-400 text-sm">
                    <Shield className="h-3 w-3" />
                    Administrador
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="h-5 w-5 text-gray-500" />
              <span>{user.email}</span>
            </div>
          </div>
        </Card>

        {/* Security Card */}
        {/* <Card>
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Seguridad</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                            <div>
                <p className="font-medium text-gray-100">Autenticación de Dos Factores</p>
                <p className="text-sm text-gray-400 mt-1">
                  {user.twoFactorEnabled ? 'Activada' : 'No configurada'}
                </p>
              </div>
              <Button
                variant={user.twoFactorEnabled ? 'outline' : 'primary'}
                size="md"
                onClick={() => router.push(ROUTES.TWO_FACTOR_SETUP)}
              >
                {user.twoFactorEnabled ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
              <div>
                <p className="font-medium text-gray-100">Contraseña</p>
                <p className="text-sm text-gray-400 mt-1">Última actualización hace 30 días</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Cambiar
              </Button>
            </div>
          </div>
        </Card> */}

        {/* Stats Card */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dark-900 rounded-lg">
              <p className="text-sm text-gray-400">Productos Publicados</p>
              <p className="text-2xl font-bold text-primary-400 mt-1">0</p>
            </div>
            <div className="p-4 bg-dark-900 rounded-lg">
              <p className="text-sm text-gray-400">Órdenes Realizadas</p>
              <p className="text-2xl font-bold text-primary-400 mt-1">0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
