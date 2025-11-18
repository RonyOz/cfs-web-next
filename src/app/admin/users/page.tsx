'use client';

/**
 * Admin Users Page
 * TODO: Implementar gestión de usuarios (admin only)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, CreateUserInput, UpdateUserInput } from '@/types';
import { UserTable, UserModal } from '@/components/admin';
import { Button } from '@/components/ui';
import { Plus, Users } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser, getSellerProfile } from '@/lib/api/users';
import { useAuth } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { ROUTES } from '@/config/constants';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    if (!isAdmin) {
      router.push(ROUTES.HOME);
      toast.error('No tienes permisos de administrador');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      
      // Si productsCount no viene del backend, enriquecer con sellerProfile
      const enrichedUsers = await Promise.all(
        data.map(async (user) => {
          // Si ya tiene productsCount válido, usar ese
          if (user.productsCount !== undefined && user.productsCount !== null) {
            return user;
          }
          
          // Si tiene products array, contar manualmente
          if (user.products && user.products.length > 0) {
            return { ...user, productsCount: user.products.length };
          }
          
          // Como último recurso, obtener de sellerProfile
          try {
            const sellerProfile = await getSellerProfile(user.id);
            return { ...user, productsCount: sellerProfile.productsCount || 0 };
          } catch (error) {
            console.warn(`No se pudo obtener productsCount para ${user.username}`);
            return { ...user, productsCount: 0 };
          }
        })
      );
      
      setUsers(enrichedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmitUser = async (data: CreateUserInput | UpdateUserInput, userId?: string) => {
    try {
      if (userId) {
        await updateUser(userId, data as UpdateUserInput);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await createUser(data as CreateUserInput);
        toast.success('Usuario creado exitosamente');
      }
      await fetchUsers();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error?.message || 'Error al guardar usuario');
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error?.message || 'Error al eliminar usuario');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary-400" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-400 mt-2">
            Administra todos los usuarios del sistema
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateUser}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Total Usuarios</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{users.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Administradores</p>
          <p className="text-3xl font-bold text-primary-400 mt-2">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Con 2FA</p>
          <p className="text-3xl font-bold text-success-500 mt-2">
            {users.filter((u) => u.twoFactorEnabled).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
}
