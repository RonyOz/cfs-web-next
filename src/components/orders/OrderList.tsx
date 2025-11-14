'use client';

import { useState } from 'react';
import { Order } from '@/types';
import { OrderCard } from './OrderCard';
import { Button } from '@/components/ui';
import { ORDER_STATUS } from '@/config/constants';
import { Package } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
  loading?: boolean;
}

export const OrderList = ({ orders, onCancel, showActions = true, loading = false }: OrderListProps) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-lg text-gray-400">No tienes órdenes aún</p>
          <p className="text-sm text-gray-500 mt-2">Comienza explorando productos</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          Todas ({orders.length})
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.PENDING ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.PENDING)}
        >
          Pendientes ({orders.filter(o => o.status === ORDER_STATUS.PENDING).length})
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.COMPLETED ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.COMPLETED)}
        >
          Completadas ({orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length})
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.CANCELLED ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.CANCELLED)}
        >
          Canceladas ({orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length})
        </Button>
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No hay órdenes con este estado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={onCancel}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};
