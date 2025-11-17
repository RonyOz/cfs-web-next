'use client';

import { useState, useEffect } from 'react';
import { User, CreateUserInput, UpdateUserInput } from '@/types';
import { Button, Input, Card } from '@/components/ui';
import { X } from 'lucide-react';

interface UserModalProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput, userId?: string) => Promise<void>;
}

export const UserModal = ({ user, isOpen, onClose, onSubmit }: UserModalProps) => {
  const isEditMode = !!user;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditMode) {
        const updateData: UpdateUserInput = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await onSubmit(updateData, user.id);
      } else {
        const createData: CreateUserInput = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">
            {isEditMode ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de usuario"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            minLength={3}
            placeholder="johndoe"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="user@example.com"
          />

          <Input
            label={isEditMode ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!isEditMode}
            minLength={6}
            placeholder="••••••••"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
              className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isLoading}
            >
              {isEditMode ? 'Actualizar' : 'Crear Usuario'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
