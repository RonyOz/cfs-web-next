'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin as MapPinIcon, Calendar, Clock, CheckCircle, XCircle, CreditCard, User, Phone } from 'lucide-react';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { useAuth, useOrders } from '@/lib/hooks';
import { Order, OrderStatus } from '@/types';
import { ROUTES } from '@/config/constants';
import { formatPrice, formatDateTime, getStatusText, capitalizeFirstLetter } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { fetchOrderById, deleteOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then(p => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated || !orderId) {
      if (!isAuthenticated) router.push(ROUTES.AUTH);
      return;
    }
    loadOrder();
  }, [isAuthenticated, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      console.error('❌ [Order Detail] Error al cargar orden:', err);
      setError(err.message || 'Error al cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'pending') return;
    try {
      await deleteOrder(order.id);
      toast.success('Orden cancelada exitosamente', {
        duration: 3000,
        position: 'top-center',
      });
      router.push(ROUTES.ORDERS);
    } catch (err) {
      toast.error('Error al cancelar la orden', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setShowCancelDialog(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-warning-500" />;
      case 'accepted': return <Package className="h-6 w-6 text-primary-500" />;
      case 'delivered': return <CheckCircle className="h-6 w-6 text-success-500" />;
      case 'canceled': return <XCircle className="h-6 w-6 text-danger-500" />;
      default: return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-danger-500">{error || 'Orden no encontrada'}</p>
          <Link href={ROUTES.ORDERS}>
            <Button variant="primary" size="md" className="mt-4">
              Volver a Órdenes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <Link href={ROUTES.ORDERS}>
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Órdenes
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
            Orden #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 w-fit">
          {getStatusIcon(order.status)}
          <span className={`text-base sm:text-lg font-semibold ${
            order.status === OrderStatus.PENDING ? 'text-warning-500' :
            order.status === OrderStatus.DELIVERED ? 'text-success-500' :
            order.status === OrderStatus.ACCEPTED ? 'text-primary-500' :
            'text-danger-500'
          }`}>
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Productos</h2>
        <div className="space-y-4">
          {order.items?.map((item, index) => {
            // Usar priceAtPurchase si existe, sino price como fallback
            const itemPrice = item.priceAtPurchase ?? item.price ?? 0;
            
            return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-dark-900 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-100">
                    {typeof item.product === 'object' ? item.product.name : 'Producto'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Cantidad: {item.quantity} x {formatPrice(itemPrice)}
                  </p>
                </div>
                <p className="text-lg font-bold text-primary-400">
                  {formatPrice(itemPrice * item.quantity)}
                </p>
              </div>
            );
          }) || (
            <p className="text-gray-400 text-center py-4">No hay productos en esta orden</p>
          )}
        </div>
      </Card>

      {/* Meeting Place & Payment Method */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary-400" />
            Lugar de Encuentro
          </h2>
          <p className="text-gray-300">{order.meetingPlace}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-400" />
            Método de Pago
          </h2>
          <p className="text-gray-300">{order.paymentMethod}</p>
        </Card>
      </div>

      {/* Seller Info */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary-400" />
          Vendedor
        </h2>
        <div className="space-y-2">
          {order.items && order.items.length > 0 && order.items.map((item, index) => {
            const seller = typeof item.product === 'object' && typeof item.product.seller === 'object' 
              ? item.product.seller 
              : null;
            
            if (!seller) return null;
            
            return (
              <div key={index} className="p-4 bg-dark-900 rounded-lg border border-dark-700 hover:border-primary-400/50 transition-all duration-300">
                <p className="text-xs text-gray-500 mb-2">Producto: {typeof item.product === 'object' ? item.product.name : 'N/A'}</p>
                <Link 
                  href={`/admin/users/${seller.id}`}
                  className="text-gray-100 font-medium hover:text-primary-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <User className="h-4 w-4 text-primary-400 group-hover:scale-110 transition-transform" />
                  {capitalizeFirstLetter(seller.username)}
                </Link>
                {seller.phoneNumber && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <Phone className="h-4 w-4 text-primary-400" />
                    <a 
                      href={`tel:${seller.phoneNumber}`}
                      className="hover:text-primary-400 transition-colors duration-300"
                    >
                      {seller.phoneNumber}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
          {(!order.items || order.items.length === 0 || !order.items.some(item => typeof item.product === 'object' && typeof item.product.seller === 'object')) && (
            <p className="text-gray-400 text-center py-2">Información del vendedor no disponible</p>
          )}
        </div>
      </Card>

      {/* Summary */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Resumen</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-300">
            <span>Subtotal</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>Impuestos</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="h-px bg-dark-700 my-3"></div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-100">Total</span>
            <span className="text-2xl font-bold text-primary-400">{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {order.status === 'pending' && (
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={() => setShowCancelDialog(true)}
        >
          Cancelar Orden
        </Button>
      )}

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancelar Orden"
        message="¿Estás seguro de cancelar esta orden? Esta acción no se puede deshacer."
        confirmText="Cancelar Orden"
        cancelText="Volver"
        variant="danger"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
}
