/** 
 * TODO: Add order status badge styling
 * TODO: Show cancel button only for pending orders and owner/admin
 * TODO: Show order details on click
 */

'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { Card, Button } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ROUTES, ORDER_STATUS } from '@/config/constants';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
}

export const OrderCard = ({ order, onCancel, showActions = true }: OrderCardProps) => {
  // TODO: Get current user from auth store
  // const { user, isAdmin } = useAuth();
  
  // TODO: Check if current user can cancel order
  // const canCancel = (user?.id === order.buyer.id || isAdmin) && order.status === ORDER_STATUS.PENDING;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      [ORDER_STATUS.PENDING]: 'bg-warning-100 text-warning-700',
      [ORDER_STATUS.COMPLETED]: 'bg-success-100 text-success-700',
      [ORDER_STATUS.CANCELLED]: 'bg-danger-100 text-danger-700',
    };

    const labels: Record<string, string> = {
      [ORDER_STATUS.PENDING]: 'Pendiente',
      [ORDER_STATUS.COMPLETED]: 'Completado',
      [ORDER_STATUS.CANCELLED]: 'Cancelado',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={ROUTES.ORDER_DETAIL(order.id)}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
              Orden #{order.id.slice(0, 8)}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Order Items Summary */}
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.quantity}x {item.product.name}
            </span>
            <span className="text-gray-900 font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Actions */}
      {showActions && onCancel && order.status === ORDER_STATUS.PENDING && (
        <div className="mt-4">
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={() => onCancel(order.id)}
          >
            Cancelar Orden
          </Button>
        </div>
      )}
    </Card>
  );
};
