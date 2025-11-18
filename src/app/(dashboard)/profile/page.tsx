'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, X } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { getMyProducts } from '@/lib/api/products';
import { getMyOrders } from '@/lib/api/orders';
import type { Order, Product } from '@/types';
import { ROUTES } from '@/config/constants';
import { updateMyProfile } from '@/lib/api/users';
import type { UpdateUserInput } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, _hasHydrated, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, monthlyOrders: 0 });
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) router.push(ROUTES.AUTH);
  }, [isAuthenticated, _hasHydrated, router]);

  useEffect(() => {
    if (user && isModalOpen) {
      setFormData({ username: user.username, email: user.email, password: '' });
    }
  }, [user, isModalOpen]);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !user) return;

    let cancelled = false;

    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const [products, orders] = await Promise.all([getMyProducts(), getMyOrders()]);
        if (cancelled) return;

        const productList = products ?? [];
        const orderList = orders ?? [];
        const buckets = buildMonthlyBuckets(orderList);
        setChartData(buckets);
        setStats({
          products: productList.length,
          orders: orderList.length,
          monthlyOrders: buckets[buckets.length - 1]?.value ?? 0,
        });
        setRecentProducts(productList);
        setRecentOrders(orderList);
      } catch (err: any) {
        if (!cancelled) {
          setStatsError(err?.message || 'No se pudieron cargar tus estadísticas');
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [_hasHydrated, isAuthenticated, user?.id]);

  const buildMonthlyBuckets = (orders: Order[]) => {
    const now = new Date();
    const buckets: { label: string; key: string; value: number }[] = Array.from({ length: 6 }).map(
      (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        return {
          label: date.toLocaleString('es-ES', { month: 'short' }),
          key,
          value: 0,
        };
      },
    );

    orders.forEach((order) => {
      if (!order?.createdAt) return;
      const created = new Date(order.createdAt);
      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) {
        bucket.value += 1;
      }
    });

    return buckets;
  };

  if (!isAuthenticated || !user) return null;

  const maxOrdersValue = chartData.length ? Math.max(...chartData.map((c) => c.value), 1) : 0;
  const chartPoints =
    chartData.length > 0
      ? chartData.map((point, index) => {
          const x =
            chartData.length === 1 ? 0 : (index / (chartData.length - 1)) * 100;
          const y = maxOrdersValue > 0 ? 100 - (point.value / maxOrdersValue) * 100 : 100;
          return `${x},${y}`;
        })
      : [];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSaving(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const payload: UpdateUserInput = {};

    const nextUsername = formData.username.trim();
    if (nextUsername && nextUsername !== user.username) {
      payload.username = nextUsername;
    }

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    if (!Object.keys(payload).length) {
      toast.error('No hay cambios para guardar');
      return;
    }

    // GraphQL API requires the invariant email field, even si no cambia.
    payload.email = user.email;
    payload.username = nextUsername || user.username;

    setIsSaving(true);
    try {
      const updated = await updateMyProfile(user.id, payload);
      setUser(updated);
      toast.success('Perfil actualizado correctamente');
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
    <div className="max-w-6xl">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <Card className="rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-lg shadow-black/20 p-5">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Tu actividad</h3>
            <nav className="space-y-6 text-sm text-gray-300">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Productos</p>
                <ul className="space-y-2">
                  {recentProducts.slice(0, 5).map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`${ROUTES.PRODUCT_DETAIL(product.id)}/edit`}
                        className="block rounded-lg border border-dark-700/60 bg-dark-900/40 px-3 py-2 text-sm text-gray-200 transition hover:border-primary-400/50 hover:text-primary-200"
                      >
                        <p className="font-medium text-gray-100">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock {product.stock}</p>
                      </Link>
                    </li>
                  ))}
                  {!recentProducts.length && (
                    <li className="text-xs text-gray-500">Aún no publicas productos.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Órdenes</p>
                <ul className="space-y-2">
                  {recentOrders.slice(0, 5).map((order) => (
                    <li
                      key={order.id}
                      className="rounded-lg border border-dark-700/60 bg-dark-900/40 px-3 py-2 text-sm text-gray-200"
                    >
                      <p className="font-medium text-gray-100">Orden #{order.id.slice(0, 6)}...</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt ?? '').toLocaleDateString()} · {order.status}
                      </p>
                    </li>
                  ))}
                  {!recentOrders.length && (
                    <li className="text-xs text-gray-500">Aún no realizas órdenes.</li>
                  )}
                </ul>
              </div>
            </nav>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-6 shadow-lg shadow-black/30">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dark-700 bg-dark-900">
                  <User className="h-12 w-12 text-primary-300" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white">{user.username}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  {isAdmin && (
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary-400/40 px-3 py-1 text-sm text-primary-300">
                      <Shield className="h-4 w-4" />
                      Administrador
                    </span>
                  )}
                </div>
              </div>
              <Button variant="primary" className="self-start md:self-auto" onClick={handleOpenModal}>
                Editar perfil
              </Button>
            </div>
          </div>

          {statsError && (
            <div className="rounded-xl border border-danger-600/50 bg-danger-600/10 px-4 py-3 text-sm text-danger-100 shadow shadow-danger-900/20">
              {statsError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Productos publicados</p>
              <p className="mt-3 text-4xl font-semibold text-primary-300">
                {statsLoading ? '...' : stats.products}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Total histórico</p>
            </Card>
            <Card className="rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Órdenes realizadas</p>
              <p className="mt-3 text-4xl font-semibold text-primary-300">
                {statsLoading ? '...' : stats.orders}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Compras totales</p>
            </Card>
            <Card className="rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Órdenes este mes</p>
              <p className="mt-3 text-4xl font-semibold text-primary-200">
                {statsLoading ? '...' : stats.monthlyOrders}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Actividad reciente</p>
            </Card>
          </div>

          <Card className="rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-lg shadow-black/20">
            <div>
              <p className="text-sm text-gray-400">Órdenes por mes</p>
              <p className="text-lg font-semibold text-gray-100">Últimos 6 meses</p>
            </div>
            <div className="mt-6 h-40 w-full">
              {chartData.length > 0 ? (
                <div className="relative h-full w-full">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <defs>
                      <linearGradient id="ordersLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#ordersLine)"
                      strokeWidth="2"
                      points={chartPoints.join(' ')}
                    />
                    <polyline
                      fill="url(#ordersLine)"
                      stroke="none"
                      opacity="0.15"
                      points={`${chartPoints.join(' ')} 100,100 0,100`}
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-xs uppercase tracking-wide text-gray-500">
                    {chartData.map((point) => (
                      <span key={`${point.label}-label`}>{point.label}</span>
                    ))}
                  </div>
                </div>
              ) : statsLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Cargando estadísticas...
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No hay órdenes registradas.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="relative w-full max-w-md p-6">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Editar perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de usuario"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                minLength={3}
              />
              <Input
                label="Correo institucional"
                type="email"
                value={formData.email}
                disabled
                readOnly
                helperText="Este correo es tu identificador y no puede modificarse."
              />
              <Input
                label="Contraseña (opcional)"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                minLength={6}
                placeholder="********"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" isLoading={isSaving} className="flex-1">
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
