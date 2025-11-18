'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  isLoading?: boolean;
  onViewProfile?: (userId: string) => void;
}

export const UserTable = ({ users, onEdit, onDelete, isLoading, onViewProfile }: UserTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({ isOpen: false, userId: null });

  const handleDelete = (userId: string) => {
    setConfirmDialog({ isOpen: true, userId });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.userId) return;
    setDeletingId(confirmDialog.userId);
    await onDelete(confirmDialog.userId);
    setDeletingId(null);
    setConfirmDialog({ isOpen: false, userId: null });
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        </div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No hay usuarios registrados</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  2FA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left hover:text-primary-400 transition-colors"
                      onClick={() => onViewProfile?.(user.id)}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary-400/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-400">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-100 underline-offset-2">
                        {user.username}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">
                      {user.phoneNumber || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                        user.role === 'admin'
                          ? 'bg-primary-400/20 text-primary-400'
                          : 'bg-gray-600/20 text-gray-400'
                      )}
                    >
                      {user.role === 'admin' && <Shield className="h-3 w-3" />}
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 rounded text-xs font-medium',
                        user.twoFactorEnabled
                          ? 'bg-success-500/20 text-success-500'
                          : 'bg-gray-600/20 text-gray-500'
                      )}
                    >
                      {user.twoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">
                      {user.productsCount ?? user.products?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProfile?.(user.id)}
                      >
                        Ver perfil
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        isLoading={deletingId === user.id}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar Usuario"
        message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, userId: null })}
      />
    </Card>
  );
};
