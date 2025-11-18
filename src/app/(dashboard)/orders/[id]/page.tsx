'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth, useOrders } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { fetchOrderById, deleteOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      
      // Logs de depuración
      console.log('📦 [Order Detail] Orden completa del backend:', data);
      console.log('📦 [Order Detail] Items de la orden:', data.items);
      if (data.items && data.items.length > 0) {
        console.log('📦 [Order Detail] Primer item:', data.items[0]);
        console.log('📦 [Order Detail] Estructura del primer item:', {
          id: data.items[0].id,
          quantity: data.items[0].quantity,
          price: data.items[0].price,
          priceAtPurchase: data.items[0].priceAtPurchase,
          product: data.items[0].product,
        });
      }
      
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
    if (confirm('¿Estás seguro de cancelar esta orden?')) {
      try {
        await deleteOrder(order.id);
        router.push(ROUTES.ORDERS);
      } catch (err) {
        alert('Error al cancelar la orden');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-warning-500" />;
      case 'completed': return <CheckCircle className="h-6 w-6 text-success-500" />;
      case 'cancelled': return <XCircle className="h-6 w-6 text-danger-500" />;
      default: return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Orden #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusIcon(order.status)}
          <span className={`text-lg font-semibold ${
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
            
            // Log de depuración por item
            console.log(`📦 [Order Detail] Item #${index}:`, {
              item,
              priceAtPurchase: item.priceAtPurchase,
              price: item.price,
              itemPrice,
              quantity: item.quantity,
              total: itemPrice * item.quantity
            });
            
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
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
          onClick={handleCancelOrder}
        >
          Cancelar Orden
        </Button>
      )}
    </div>
  );
}
