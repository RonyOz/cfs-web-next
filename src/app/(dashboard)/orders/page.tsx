'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useOrders } from '@/lib/hooks';
import { OrderList } from '@/components/orders';
import { ROUTES } from '@/config/constants';
import { ConfirmDialog } from '@/components/ui';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuth();
  const { orders, loading, error, fetchMyOrders, deleteOrder } = useOrders();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    orderId: string | null;
  }>({ isOpen: false, orderId: null });

  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    fetchMyOrders();
  }, [isAuthenticated, _hasHydrated]);

  const handleCancel = (orderId: string) => {
    setConfirmDialog({ isOpen: true, orderId });
  };

  const confirmCancel = async () => {
    if (!confirmDialog.orderId) return;
    try {
      await deleteOrder(confirmDialog.orderId);
      fetchMyOrders();
      toast.success('Orden cancelada exitosamente', {
        duration: 3000,
        position: 'top-center',
      });
    } catch (err) {
      toast.error('Error al cancelar la orden', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setConfirmDialog({ isOpen: false, orderId: null });
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

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Cancelar Orden"
        message="¿Estás seguro de cancelar esta orden? Esta acción no se puede deshacer."
        confirmText="Cancelar Orden"
        cancelText="Volver"
        variant="danger"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null })}
      />
    </div>
  );
}
