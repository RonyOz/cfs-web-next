'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { getAllUsers } from '@/lib/api/users';
import { getProducts } from '@/lib/api/products';
import { getOrders } from '@/lib/api/orders';
import { User, Product, Order, OrderStatus } from '@/types';
import { ROUTES } from '@/config/constants';
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, user, _hasHydrated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: [] as User[],
    products: [] as Product[],
    orders: [] as Order[],
  });

  useEffect(() => {
    // Esperar a que el store se hidrate antes de verificar autenticación
    if (!_hasHydrated) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    if (!isAdmin) {
      router.push(ROUTES.HOME);
      toast.error('No tienes permisos de administrador');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, isAuthenticated, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, products, orders] = await Promise.all([
        getAllUsers(),
        getProducts(),
        getOrders(),
      ]);
      setStats({ users, products, orders });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
        </div>
      </div>
    );
  }

  const totalUsers = stats.users.length;
  const totalAdmins = stats.users.filter((u) => u.role === 'admin').length;
  const totalProducts = stats.products.length;
  const lowStockProducts = stats.products.filter((p) => p.stock < 10).length;
  const outOfStockProducts = stats.products.filter((p) => p.stock === 0).length;
  const totalOrders = stats.orders.length;
  const pendingOrders = stats.orders.filter((o) => o.status === OrderStatus.PENDING).length;
  const acceptedOrders = stats.orders.filter((o) => o.status === OrderStatus.ACCEPTED).length;
  const deliveredOrders = stats.orders.filter((o) => o.status === OrderStatus.DELIVERED).length;
  const canceledOrders = stats.orders.filter((o) => o.status === OrderStatus.CANCELED).length;
  // El backend devuelve total y price como strings, necesitamos convertirlos a números
  const totalRevenue = stats.orders
    .filter((o) => o.status === OrderStatus.DELIVERED)
    .reduce((sum, o) => sum + (parseFloat(o.total as any) || 0), 0);
  const inventoryValue = stats.products.reduce(
    (sum, p) => sum + (parseFloat(p.price as any) || 0) * p.stock, 
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary-400" />
          Dashboard del Administrador
        </h1>
        <p className="text-gray-400 mt-2">
          Vista general del sistema Campus Food Sharing
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <Link href={ROUTES.ADMIN_USERS}>
          <Card hover className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">{totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">{totalAdmins} administradores</p>
              </div>
              <div className="h-12 w-12 bg-primary-400/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-400" />
              </div>
            </div>
          </Card>
        </Link>

        {/* Products Stats */}
        <Link href={ROUTES.ADMIN_PRODUCTS}>
          <Card hover className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Productos</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">{totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">{outOfStockProducts} agotados</p>
              </div>
              <div className="h-12 w-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </Link>

        {/* Orders Stats */}
        <Link href={ROUTES.ADMIN_ORDERS}>
          <Card hover className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Órdenes</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">{totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">{pendingOrders} pendientes</p>
              </div>
              <div className="h-12 w-12 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </Link>

        {/* Revenue Stats */}
        <Card>
          <div>
            <p className="text-gray-400 text-sm font-medium">Ingresos Totales</p>
            <p className="text-3xl font-bold text-success-500 mt-2">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">{deliveredOrders} órdenes completadas</p>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-400" />
            Estado de Órdenes
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-300">Pendientes</span>
              </div>
              <span className="text-sm font-bold text-yellow-500">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-300">Aceptadas</span>
              </div>
              <span className="text-sm font-bold text-blue-500">{acceptedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span className="text-sm text-gray-300">Entregadas</span>
              </div>
              <span className="text-sm font-bold text-success-500">{deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-danger-500" />
                <span className="text-sm text-gray-300">Canceladas</span>
              </div>
              <span className="text-sm font-bold text-danger-500">{canceledOrders}</span>
            </div>
          </div>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-400" />
            Alertas de Inventario
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-danger-600/10 border border-danger-600 rounded-lg">
              <div>
                <p className="text-sm font-medium text-danger-500">Productos Agotados</p>
                <p className="text-xs text-gray-500">Requieren reabastecimiento</p>
              </div>
              <span className="text-2xl font-bold text-danger-500">{outOfStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-600/10 border border-yellow-600 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-500">Stock Bajo</p>
                <p className="text-xs text-gray-500">Menos de 10 unidades</p>
              </div>
              <span className="text-2xl font-bold text-yellow-500">{lowStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-300">Valor del Inventario</p>
                <p className="text-xs text-gray-500">Total en stock</p>
              </div>
              <span className="text-lg font-bold text-primary-400">{formatPrice(inventoryValue)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.ADMIN_USERS)}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Gestionar Usuarios
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.ADMIN_PRODUCTS)}
            className="gap-2"
          >
            <Package className="h-4 w-4" />
            Gestionar Productos
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.ADMIN_ORDERS)}
            className="gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Gestionar Órdenes
          </Button>
        </div>
      </Card>
    </div>
  );
}
