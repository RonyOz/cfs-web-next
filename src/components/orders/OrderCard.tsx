'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { Card, Button } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ROUTES, ORDER_STATUS } from '@/config/constants';
import { useAuth } from '@/lib/hooks';
import { Package, Clock, CheckCircle, XCircle, MapPin, CreditCard } from 'lucide-react';

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
      [ORDER_STATUS.ACCEPTED]: {
        icon: Clock,
        color: 'text-primary-500',
        bg: 'bg-primary-600/20',
        border: 'border-primary-600',
        label: 'Aceptado',
      },
      [ORDER_STATUS.DELIVERED]: {
        icon: CheckCircle,
        color: 'text-success-500',
        bg: 'bg-success-600/20',
        border: 'border-success-600',
        label: 'Entregado',
      },
      [ORDER_STATUS.CANCELED]: {
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1">
          <Link href={ROUTES.ORDER_DETAIL(order.id)}>
            <h3 className="text-lg font-semibold text-gray-100 hover:text-primary-400 transition-colors">
              Orden #{order.id.slice(0, 8)}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.border} border w-fit`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span className={statusConfig.color}>{statusConfig.label}</span>
        </span>
      </div>

      {/* Meeting Place & Payment Method */}
      <div className="mb-4 space-y-2">
        <div className="p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Lugar de Encuentro</p>
              <p className="text-sm text-gray-200">{order.meetingPlace}</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <div className="flex items-start gap-2">
            <CreditCard className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Método de Pago</p>
              <p className="text-sm text-gray-200">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
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
