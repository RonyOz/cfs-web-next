'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { Card, Button } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ROUTES, ORDER_STATUS } from '@/config/constants';
import { useAuth } from '@/lib/hooks';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
}

export const OrderCard = ({ order, onCancel, showActions = true }: OrderCardProps) => {
  const { user, isAdmin } = useAuth();
  const canCancel = (user?.id === order.buyer.id || isAdmin) && order.status === ORDER_STATUS.PENDING;

  const getStatusConfig = (status: string) => {
    const configs = {
      [ORDER_STATUS.PENDING]: {
        icon: Clock,
        color: 'text-warning-500',
        bg: 'bg-warning-600/20',
        border: 'border-warning-600',
        label: 'Pendiente',
      },
      [ORDER_STATUS.COMPLETED]: {
        icon: CheckCircle,
        color: 'text-success-500',
        bg: 'bg-success-600/20',
        border: 'border-success-600',
        label: 'Completado',
      },
      [ORDER_STATUS.CANCELLED]: {
        icon: XCircle,
        color: 'text-danger-500',
        bg: 'bg-danger-600/20',
        border: 'border-danger-600',
        label: 'Cancelado',
      },
    };
    return configs[status as keyof typeof configs] || configs[ORDER_STATUS.PENDING];
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card hover>
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={ROUTES.ORDER_DETAIL(order.id)}>
            <h3 className="text-lg font-semibold text-gray-100 hover:text-primary-400 transition-colors">
              Orden #{order.id.slice(0, 8)}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.border} border`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span className={statusConfig.color}>{statusConfig.label}</span>
        </span>
      </div>

      {/* Order Items Summary */}
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-400">
              {item.quantity}x {item.product.name}
            </span>
            <span className="text-gray-100 font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-dark-700 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-100">Total</span>
        <span className="text-2xl font-bold text-primary-400">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Actions */}
      {showActions && onCancel && canCancel && (
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
