'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, Search, AlertCircle } from 'lucide-react';
import { Button, ConfirmDialog, Input } from '@/components/ui';
import { useAuth, useProducts } from '@/lib/hooks';
import { ProductCard } from '@/components/products';
import { ROUTES } from '@/config/constants';
import toast from 'react-hot-toast';
import { Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuth();
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Esperar a que el store se hidrate antes de verificar autenticación
    if (!_hasHydrated) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    fetchProducts();
  }, [isAuthenticated, _hasHydrated]);

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || 
           product.description.toLowerCase().includes(query);
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    productId: string | null;
  }>({ isOpen: false, productId: null });

  const handleDelete = (productId: string) => {
    setConfirmDialog({ isOpen: true, productId });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.productId) return;
    try {
      await deleteProduct(confirmDialog.productId);
      toast.success('Producto eliminado exitosamente', {
        duration: 3000,
        position: 'top-center',
      });
    } catch (err) {
      toast.error('Error al eliminar el producto', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setConfirmDialog({ isOpen: false, productId: null });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Mis Productos</h1>
          <p className="mt-1 text-gray-400">
            {filteredProducts.length} productos encontrados
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="gap-2"
          onClick={() => router.push(ROUTES.PRODUCT_NEW)}
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          prefixIcon={<Search className="h-5 w-5" />}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Cargando productos...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center justify-center py-16">
          <div className="rounded-lg border border-danger-600 bg-danger-600/10 p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-danger-500" />
            <p className="mt-4 text-lg font-medium text-danger-500">{error}</p>
            <Button
              variant="danger"
              size="sm"
              className="mt-4"
              onClick={() => fetchProducts()}
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg text-gray-400">
                  {searchQuery
                    ? `No se encontraron productos para "${searchQuery}"`
                    : 'No tienes productos publicados'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-4 gap-2"
                    onClick={() => router.push(ROUTES.PRODUCT_NEW)}
                  >
                    <Plus className="h-4 w-4" />
                    Crear tu primer producto
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar Producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, productId: null })}
      />
    </div>
  );
}
