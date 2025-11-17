'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button, Card, Input } from '@/components/ui';
import { Package, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth, useProducts } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { ROUTES } from '@/config/constants';
import { formatPrice, cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof product.seller === 'object' && product.seller.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(productId);
        await deleteProduct(productId);
        toast.success('Producto eliminado exitosamente');
      } catch (error: any) {
        toast.error(error?.message || 'Error al eliminar producto');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`${ROUTES.PRODUCTS}/${productId}/edit`);
  };

  const lowStockProducts = products.filter((p) => p.stock < 10);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary-400" />
          Gestión de Productos
        </h1>
        <p className="text-gray-400 mt-2">
          Administra todos los productos del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Total Productos</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{products.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Agotados</p>
          <p className="text-3xl font-bold text-danger-500 mt-2">{outOfStockProducts.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Stock Bajo</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{lowStockProducts.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-medium">Valor Total</p>
          <p className="text-3xl font-bold text-primary-400 mt-2">
            {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por nombre o vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No se encontraron productos</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Imagen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vendedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 bg-dark-700 rounded overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-100">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {typeof product.seller === 'object' ? product.seller.username : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary-400">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 rounded text-xs font-medium',
                          product.stock === 0
                            ? 'bg-danger-500/20 text-danger-500'
                            : product.stock < 10
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-success-500/20 text-success-500'
                        )}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product.id)} className="gap-1">
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          isLoading={deletingId === product.id}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
