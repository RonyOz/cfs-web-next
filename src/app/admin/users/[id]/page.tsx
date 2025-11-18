'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Shield,
  Calendar,
  Package,
  Activity,
  User as UserIcon,
  Receipt,
  BadgeDollarSign,
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { User, Product, UpdateUserInput, Order, OrderStatus } from '@/types';
import { getUserById, updateUser } from '@/lib/api/users';
import { ROUTES } from '@/config/constants';
import { cn, formatDateTime, formatPrice } from '@/lib/utils';
import { UserModal } from '@/components/admin';
import toast from 'react-hot-toast';
import { getOrders } from '@/lib/api/orders';

type AdminUserProfile = User & {
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
};

export default function AdminUserProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = useMemo(() => {
    const id = params?.id;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const [profile, setProfile] = useState<AdminUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!userId) return;
    fetchProfile(userId);
    fetchUserOrders(userId);
  }, [userId]);

  useEffect(() => {
    if (profile?.status) {
      setStatus(profile.status);
    }
  }, [profile?.status]);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserById(id);
      setProfile(data as AdminUserProfile);
      setStatus((data as AdminUserProfile).status ?? 'active');
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err?.message || 'No se pudo cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (id: string) => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const data = await getOrders();
      const filteredOrders = data.filter((order) => {
        const buyerId =
          typeof order.buyer === 'object' ? order.buyer.id : (order.buyer as any);
        return buyerId === id;
      });
      setOrders(filteredOrders);
    } catch (err: any) {
      console.error('Error fetching user orders:', err);
      setOrdersError(err?.message || 'No se pudieron cargar las órdenes');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEditUser = async (
    payload: UpdateUserInput,
    overrideId?: string
  ) => {
    if (!profile) return;
    try {
      const targetId = overrideId || profile.id;
      await updateUser(targetId, payload);
      toast.success('Usuario actualizado exitosamente');
      setIsModalOpen(false);
      fetchProfile(targetId);
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast.error(err?.message || 'No se pudo actualizar el usuario');
      throw err;
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = status === 'active' ? 'inactive' : 'active';
    try {
      setTogglingStatus(true);
      // TODO: Reemplazar con llamada al backend cuando exista endpoint de estado
      setStatus(nextStatus);
      toast.success(
        `Usuario ${nextStatus === 'active' ? 'activado' : 'desactivado'}`
      );
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo actualizar el estado');
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-sm text-gray-400">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Card className="p-8 text-center">
          <p className="text-lg text-danger-500">
            {error || 'Usuario no encontrado'}
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push(ROUTES.ADMIN_USERS)}
          >
            Volver a Usuarios
          </Button>
        </Card>
      </div>
    );
  }

  const statusColorMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400',
    [OrderStatus.ACCEPTED]: 'bg-blue-500/20 text-blue-300',
    [OrderStatus.DELIVERED]: 'bg-success-500/20 text-success-400',
    [OrderStatus.CANCELED]: 'bg-danger-500/20 text-danger-400',
  };

  const roleBadgeStyles =
    profile.role === 'admin'
      ? 'bg-danger-500/20 text-danger-400'
      : 'bg-primary-500/20 text-primary-300';

  const statusBadgeStyles =
    status === 'active'
      ? 'bg-success-500/20 text-success-400'
      : 'bg-danger-500/20 text-danger-400';

  const products = profile.products || [];
  const ordersCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2"
        onClick={() => router.push(ROUTES.ADMIN_USERS)}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Perfil de Usuario
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-100">
            {profile.username}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold uppercase',
                roleBadgeStyles
              )}
            >
              {profile.role}
            </span>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold uppercase',
                statusBadgeStyles
              )}
            >
              {status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
            {profile.twoFactorEnabled && (
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase text-blue-300">
                2FA habilitado
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Editar usuario
          </Button>
          <Button
            variant={status === 'active' ? 'danger' : 'success'}
            onClick={handleToggleStatus}
            isLoading={togglingStatus}
          >
            {status === 'active' ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-lg font-semibold text-gray-100">
                  {profile.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-100">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="text-lg font-semibold text-gray-100">
                  {profile.role === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de creación</p>
                <p className="text-lg font-semibold text-gray-100">
                  {profile.createdAt
                    ? formatDateTime(profile.createdAt)
                    : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-100">
            Resumen de actividad
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-sm text-gray-500">Productos</p>
                  <p className="text-xl font-bold text-gray-100">
                    {profile.productsCount ?? products.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="text-xl font-bold text-gray-100">
                    {status === 'active' ? 'En servicio' : 'Suspendido'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-sm text-gray-500">Órdenes realizadas</p>
                  <p className="text-xl font-bold text-gray-100">{ordersCount}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total gastado</p>
                <p className="text-lg font-semibold text-primary-400">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-100">
              Productos asociados
            </h3>
            <p className="text-sm text-gray-500">
              {products.length > 0
                ? 'Listado de productos publicados por este usuario'
                : 'Este usuario aún no tiene productos'}
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 rounded-lg border border-dark-700 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-100">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <p className="text-xl font-bold text-primary-400">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-dark-700 p-6 text-center">
            <p className="text-gray-400">
              No hay productos registrados para este usuario.
            </p>
          </div>
        )}
      </Card>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-100">Historial de órdenes</h3>
            <p className="text-sm text-gray-500">
              {orders.length > 0
                ? 'Órdenes creadas por este usuario'
                : 'Aún no registra órdenes'}
            </p>
          </div>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
              <p className="text-sm text-gray-500">Cargando órdenes...</p>
            </div>
          </div>
        ) : ordersError ? (
          <div className="mt-6 rounded-lg border border-danger-600/50 bg-danger-600/10 p-4 text-center text-danger-400">
            {ordersError}
          </div>
        ) : orders.length > 0 ? (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-dark-700 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">ID de orden</p>
                    <p className="font-semibold text-gray-100">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Creada: {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-right md:text-left">
                    <span
                      className={cn(
                        'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
                        statusColorMap[order.status]
                      )}
                    >
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-primary-400">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-dark-700 pt-4">
                  <p className="text-sm text-gray-500">Productos</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between">
                        <span>{item.product.name}</span>
                        <span className="text-gray-400">
                          {item.quantity} x {formatPrice(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-dark-700 p-6 text-center">
            <p className="text-gray-400">No hay órdenes registradas.</p>
          </div>
        )}
      </Card>

      <UserModal
        user={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditUser}
      />
    </div>
  );
}
