'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { Eye, XCircle, Package } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onCancelOrder: (orderId: string) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-500/20 text-yellow-500';
    case OrderStatus.ACCEPTED:
      return 'bg-blue-500/20 text-blue-500';
    case OrderStatus.DELIVERED:
      return 'bg-success-500/20 text-success-500';
    case OrderStatus.CANCELED:
      return 'bg-danger-500/20 text-danger-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pendiente';
    case OrderStatus.ACCEPTED:
      return 'Aceptado';
    case OrderStatus.DELIVERED:
      return 'Entregado';
    case OrderStatus.CANCELED:
      return 'Cancelado';
    default:
      return status;
  }
};

export const OrdersTable = ({
  orders,
  onViewDetails,
  onUpdateStatus,
  onCancelOrder,
  isLoading,
}: OrdersTableProps) => {
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'status' | 'cancel' | null;
    orderId: string | null;
    newStatus?: string;
  }>({ isOpen: false, type: null, orderId: null });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'status',
      orderId,
      newStatus,
    });
  };

  const handleCancel = (orderId: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'cancel',
      orderId,
    });
  };

  const confirmAction = async () => {
    if (!confirmDialog.orderId) return;
    
    setActioningId(confirmDialog.orderId);
    
    if (confirmDialog.type === 'status' && confirmDialog.newStatus) {
      await onUpdateStatus(confirmDialog.orderId, confirmDialog.newStatus);
    } else if (confirmDialog.type === 'cancel') {
      await onCancelOrder(confirmDialog.orderId);
    }
    
    setActioningId(null);
    setConfirmDialog({ isOpen: false, type: null, orderId: null });
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No hay órdenes registradas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Comprador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-dark-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-400">
                    {order.id.slice(0, 8)}...
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-100">
                      {order.buyer.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {'email' in order.buyer ? order.buyer.email : ''}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-primary-400">
                    {formatPrice(order.total)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(order.status)
                    )}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-400">
                    {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: es })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order)}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Ver
                    </Button>

                    {order.status === OrderStatus.PENDING && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, OrderStatus.ACCEPTED)}
                          isLoading={actioningId === order.id}
                          className="gap-1"
                        >
                          Aceptar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(order.id)}
                          isLoading={actioningId === order.id}
                          className="gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Cancelar
                        </Button>
                      </>
                    )}

                    {order.status === OrderStatus.ACCEPTED && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(order.id, OrderStatus.DELIVERED)}
                        isLoading={actioningId === order.id}
                        className="gap-1"
                      >
                        Marcar Entregado
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === 'status'
            ? 'Cambiar Estado'
            : 'Cancelar Orden'
        }
        message={
          confirmDialog.type === 'status'
            ? `¿Cambiar estado de la orden a "${confirmDialog.newStatus ? getStatusText(confirmDialog.newStatus as OrderStatus) : ''}"?`
            : '¿Cancelar esta orden? Se restaurará el stock.'
        }
        confirmText={confirmDialog.type === 'status' ? 'Cambiar' : 'Cancelar Orden'}
        cancelText="Volver"
        variant={confirmDialog.type === 'cancel' ? 'danger' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null, orderId: null })}
      />
    </Card>
  );
};
