'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useOrders } from '@/lib/hooks';
import { OrderList } from '@/components/orders';
import { ROUTES } from '@/config/constants';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { orders, loading, error, fetchOrders, deleteOrder } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    fetchOrders();
  }, [isAuthenticated, fetchOrders, router]);

  const handleCancel = async (orderId: string) => {
    if (window.confirm('¿Estás seguro de cancelar esta orden?')) {
      try {
        await deleteOrder(orderId);
        fetchOrders();
      } catch (err) {
        alert('Error al cancelar la orden');
      }
    }
  };

  if (!isAuthenticated) return null;

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-danger-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Mis Órdenes</h1>
        <p className="text-gray-400 mt-2">Historial de compras</p>
      </div>

      <OrderList
        orders={orders}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
