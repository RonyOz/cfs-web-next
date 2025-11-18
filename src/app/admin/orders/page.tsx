'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types';
import { Button, Card } from '@/components/ui';
import { ShoppingBag, X } from 'lucide-react';
import { useAuth, useOrders } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { ROUTES } from '@/config/constants';
import { OrdersTable } from '@/components/admin';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const { orders, loading, fetchOrders, updateOrderStatus, cancelOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    if (!isAdmin) {
      router.push(ROUTES.HOME);
      toast.error('No tienes permisos de administrador');
      return;
    }
    fetchOrders(); // Admin obtiene todas las órdenes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);
  
  // Log de depuración cuando cambian las órdenes
  useEffect(() => {
    if (orders.length > 0) {
      console.log('🛒 [Admin Orders] Total órdenes:', orders.length);
      console.log('🛒 [Admin Orders] Primera orden:', orders[0]);
      if (orders[0].items && orders[0].items.length > 0) {
        console.log('🛒 [Admin Orders] Primer item de primera orden:', orders[0].items[0]);
        console.log('🛒 [Admin Orders] Estructura item:', {
          id: orders[0].items[0].id,
          quantity: orders[0].items[0].quantity,
          price: orders[0].items[0].price,
          priceAtPurchase: orders[0].items[0].priceAtPurchase,
        });
      }
    }
  }, [orders]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status as OrderStatus);
      toast.success(`Estado actualizado a "${status}"`);
      await fetchOrders();
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar estado');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success('Orden cancelada y stock restaurado');
      await fetchOrders();
    } catch (error: any) {
      toast.error(error?.message || 'Error al cancelar orden');
    }
  };

  const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING);
  const acceptedOrders = orders.filter((o) => o.status === OrderStatus.ACCEPTED);
  const deliveredOrders = orders.filter((o) => o.status === OrderStatus.DELIVERED);
  
  // Calcular ingresos totales con manejo de valores nulos
  // El backend devuelve total como string, necesitamos convertirlo a número
  const totalRevenue = orders
    .filter((o) => o.status === OrderStatus.DELIVERED)
    .reduce((sum, o) => {
      const orderTotal = parseFloat(o.total as any) || 0;
      console.log('💰 [Admin Orders] Revenue calc:', { 
        orderId: o.id.slice(0, 8), 
        total: o.total, 
        orderTotal,
        sum
      });
      return sum + orderTotal;
    }, 0);
  
  console.log('💰 [Admin Orders] Total Revenue:', totalRevenue);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary-400" />
          Gestión de Órdenes
        </h1>
        <p className="text-gray-400 mt-2">
          Administra todas las órdenes del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Total Órdenes</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{orders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingOrders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Entregadas</p>
          <p className="text-3xl font-bold text-success-500 mt-2">{deliveredOrders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Ingresos Totales</p>
          <p className="text-3xl font-bold text-primary-400 mt-2">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
        isLoading={loading}
      />

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Detalles de la Orden</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Order Info */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">ID de Orden</p>
                  <p className="text-sm font-mono text-gray-100">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <p className="text-sm font-semibold text-gray-100">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Comprador</p>
                  <p className="text-sm text-gray-100">{selectedOrder.buyer.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm text-gray-100">
                    {'email' in selectedOrder.buyer ? selectedOrder.buyer.email : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fecha</p>
                  <p className="text-sm text-gray-100">
                    {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-lg font-bold text-primary-400">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Productos</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => {
                  // Usar priceAtPurchase si existe, sino price como fallback
                  const itemPrice = item.priceAtPurchase ?? item.price ?? 0;
                  
                  console.log(`🛒 [Admin Orders Modal] Item:`, {
                    id: item.id,
                    product: item.product.name,
                    priceAtPurchase: item.priceAtPurchase,
                    price: item.price,
                    itemPrice,
                    quantity: item.quantity,
                  });
                  
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-dark-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-100">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-400">
                          {formatPrice(itemPrice)}
                        </p>
                        <p className="text-xs text-gray-500">por unidad</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark-700">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
