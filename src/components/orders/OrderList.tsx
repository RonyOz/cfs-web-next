/**
 * TODO: Implement pagination
 * TODO: Add loading state
 * TODO: Add empty state
 * TODO: Add filters (status, date range)
 */

'use client';

import { useState } from 'react';
import { Order } from '@/types';
import { OrderCard } from './OrderCard';
import { Button } from '@/components/ui';
import { DEFAULT_PAGE_SIZE, ORDER_STATUS } from '@/config/constants';

interface OrderListProps {
  orders: Order[];
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
}

export const OrderList = ({ orders, onCancel, showActions = true }: OrderListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // TODO: Implement filter logic
  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  // TODO: Implement pagination logic
  const totalPages = Math.ceil(filteredOrders.length / DEFAULT_PAGE_SIZE);
  const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
  const endIndex = startIndex + DEFAULT_PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tienes órdenes aún</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={statusFilter === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          Todas
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.PENDING ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.PENDING)}
        >
          Pendientes
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.COMPLETED ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.COMPLETED)}
        >
          Completadas
        </Button>
        <Button
          variant={statusFilter === ORDER_STATUS.CANCELLED ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(ORDER_STATUS.CANCELLED)}
        >
          Canceladas
        </Button>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={onCancel}
            showActions={showActions}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
