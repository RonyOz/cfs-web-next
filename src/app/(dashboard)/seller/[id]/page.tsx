'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Package, Mail, Phone, Shield } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { User, Product } from '@/types';
import { ROUTES } from '@/config/constants';
import { getSellerProfile } from '@/lib/api';
import { capitalizeFirstLetter, getStatusText, formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/products';

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuth();
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sellerId, setSellerId] = useState<string>('');

  useEffect(() => {
    params.then(p => setSellerId(p.id));
  }, [params]);

  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }

    if (sellerId) {
      loadSellerProfile();
    }
  }, [isAuthenticated, _hasHydrated, sellerId]);

  const loadSellerProfile = async () => {
    try {
      setLoading(true);
      const data = await getSellerProfile(sellerId);
      setSeller(data);
    } catch (err: any) {
      console.error('Error al cargar perfil del vendedor:', err);
      setError(err.message || 'Error al cargar el perfil del vendedor');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando perfil del vendedor...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-danger-500">{error || 'Vendedor no encontrado'}</p>
          <Button variant="primary" size="md" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar - Products List and Orders */}
        <aside className="space-y-6">
          <Card className="rounded-xl border border-dark-700 bg-dark-800 shadow-lg shadow-black/20 p-5">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">
              Actividad del vendedor
            </h3>
            <nav className="space-y-6 text-sm text-gray-300">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Productos</p>
                <ul className="space-y-2">
                  {(seller.products || []).length > 0 ? (
                    (seller.products || []).slice(0, 5).map((product: any) => (
                      <li key={product.id}>
                        <div className="block rounded-lg border border-dark-700/60 bg-dark-900/40 px-3 py-2 text-sm text-gray-200">
                          <p className="font-medium text-gray-100">{product.name}</p>
                          <p className="text-xs text-gray-500">Stock {product.stock}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500">No hay productos disponibles.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Ventas Recientes</p>
                <ul className="space-y-2">
                  {(seller.salesHistory || []).length > 0 ? (
                    (seller.salesHistory || []).slice(0, 5).map((order: any) => (
                      <li
                        key={order.id}
                        className="rounded-lg border border-dark-700/60 bg-dark-900/40 px-3 py-2 text-sm text-gray-200"
                      >
                        <p className="font-medium text-gray-100">Orden #{order.id.slice(0, 6)}...</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })} · {getStatusText(order.status)}
                        </p>
                        <p className="text-xs text-primary-400 mt-1">{formatPrice(order.total)}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500">No hay ventas registradas.</li>
                  )}
                </ul>
              </div>
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 shadow-lg shadow-black/30">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dark-700 bg-dark-900">
                  <UserIcon className="h-12 w-12 text-primary-300" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-semibold text-white">
                    {capitalizeFirstLetter(seller.username)}
                  </h2>
                  <p className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4 text-primary-300" />
                    {seller.email}
                  </p>
                  {seller.phoneNumber && (
                    <p className="flex items-center gap-2 text-gray-400">
                      <Phone className="h-4 w-4 text-primary-300" />
                      <a
                        href={`tel:${seller.phoneNumber}`}
                        className="hover:text-primary-400 transition-colors"
                      >
                        {seller.phoneNumber}
                      </a>
                    </p>
                  )}
                  {seller.role === 'admin' && (
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary-400/40 px-3 py-1 text-sm text-primary-300">
                      <Shield className="h-4 w-4" />
                      Administrador
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-xl border border-dark-700 bg-dark-800 shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Productos publicados</p>
              <p className="mt-3 text-4xl font-semibold text-primary-300">
                {seller.productsCount || 0}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Total histórico</p>
            </Card>
            <Card className="rounded-xl border border-dark-700 bg-dark-800 shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Órdenes totales</p>
              <p className="mt-3 text-4xl font-semibold text-primary-300">
                {seller.totalOrders || 0}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Ventas totales</p>
            </Card>
            <Card className="rounded-xl border border-dark-700 bg-dark-800 shadow-lg shadow-black/20">
              <p className="text-sm text-gray-400">Órdenes este mes</p>
              <p className="mt-3 text-4xl font-semibold text-primary-200">
                {seller.ordersThisMonth || 0}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Actividad reciente</p>
            </Card>
          </div>

          {/* Products Grid */}
          <Card className="rounded-xl border border-dark-700 bg-dark-800 shadow-lg shadow-black/20">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary-400" />
                Productos de {capitalizeFirstLetter(seller.username)}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {seller.products?.length || 0} productos disponibles
              </p>
            </div>

            {(seller.products || []).length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(seller.products || []).map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showActions={false}
                    hideOwnerActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-lg text-gray-400">Este vendedor no tiene productos disponibles</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
