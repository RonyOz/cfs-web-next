'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types';
import { Button, Card, Pagination } from '@/components/ui';
import { ShoppingBag, X } from 'lucide-react';
import { useAuth, useOrders } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { ROUTES } from '@/config/constants';
import { OrdersTable } from '@/components/admin';
import { formatPrice, getStatusText } from '@/lib/utils';

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuth();
  const { orders, paginationMeta, loading, fetchMySales, updateOrderStatus, cancelOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    fetchMySales(currentPage, itemsPerPage); // Obtiene solo las órdenes donde soy vendedor (filtrado por backend)
  }, [isAuthenticated, _hasHydrated]);

  // El backend ya filtra, usamos orders directamente
  const sellerOrders = orders;

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Estado actualizado exitosamente');
      await fetchMySales(currentPage, itemsPerPage);
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar estado');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success('Orden cancelada y stock restaurado');
      await fetchMySales(currentPage, itemsPerPage);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cancelar orden');
    }
  };

  const pendingOrders = sellerOrders.filter((o) => o.status === OrderStatus.PENDING);
  const acceptedOrders = sellerOrders.filter((o) => o.status === OrderStatus.ACCEPTED);
  const deliveredOrders = sellerOrders.filter((o) => o.status === OrderStatus.DELIVERED);

  // Paginación del backend
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMySales(page, itemsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchMySales(1, newItemsPerPage);
  };

  // Refetch cuando cambia página o items por página
  useEffect(() => {
    if (isAuthenticated) {
      fetchMySales(currentPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage]);
  
  // Calcular ingresos totales solo de productos del vendedor
  const totalRevenue = sellerOrders
    .filter((o) => o.status === OrderStatus.DELIVERED)
    .reduce((sum, o) => {
      const orderTotal = parseFloat(o.total as any) || 0;
      return sum + orderTotal;
    }, 0);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary-400" />
          Mis Ventas
        </h1>
        <p className="text-gray-400 mt-2">
          Gestiona los pedidos de tus productos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Total Pedidos</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{sellerOrders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingOrders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Entregados</p>
          <p className="text-3xl font-bold text-success-500 mt-2">{deliveredOrders.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Ingresos Totales</p>
          <p className="text-3xl font-bold text-primary-400 mt-2">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Orders Table */}
      {sellerOrders.length > 0 ? (
        <>
          <OrdersTable
            orders={sellerOrders}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onCancelOrder={handleCancelOrder}
            isLoading={loading}
          />

          {/* Pagination */}
          {!loading && paginationMeta && paginationMeta.total > 0 && (
            <Pagination
              currentPage={paginationMeta.page}
              totalPages={paginationMeta.totalPages}
              totalItems={paginationMeta.total}
              itemsPerPage={paginationMeta.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-500">
            Cuando alguien compre tus productos, aparecerán aquí
          </p>
        </Card>
      )}

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Detalles del Pedido</h2>
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
                  <p className="text-sm text-gray-400">ID de Pedido</p>
                  <p className="text-sm font-mono text-gray-100">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <p className="text-sm font-semibold text-gray-100">{getStatusText(selectedOrder.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Comprador</p>
                  <p className="text-sm text-gray-100">{selectedOrder.buyer.username}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400">Lugar de Encuentro</p>
                  <p className="text-sm text-gray-100">{selectedOrder.meetingPlace}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm text-gray-100">
                    {'email' in selectedOrder.buyer ? selectedOrder.buyer.email : 'N/A'}
                  </p>
                </div>
                {'phoneNumber' in selectedOrder.buyer && selectedOrder.buyer.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="text-sm text-gray-100">{selectedOrder.buyer.phoneNumber}</p>
                  </div>
                )}
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
                    const itemPrice = item.priceAtPurchase ?? item.price ?? 0;
                    
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
