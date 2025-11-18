'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, User, Package } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth, useProducts } from '@/lib/hooks';
import { useOrderStore } from '@/store';
import { ROUTES } from '@/config/constants';
import { formatPrice, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuth();
  const { selectedProduct, loading, fetchProductById, setSelectedProduct } = useProducts();
  const { addToCart } = useOrderStore();
  const [error, setError] = useState('');
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    params.then(p => setProductId(p.id));
  }, [params]);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !productId) {
      if (!_hasHydrated) return;
      if (!isAuthenticated) router.push(ROUTES.AUTH);
      return;
    }
    loadProduct();
    
    return () => {
      setSelectedProduct(null);
    };
  }, [isAuthenticated, productId]);

  const loadProduct = async () => {
    try {
      setError('');
      await fetchProductById(productId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el producto');
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      stock: selectedProduct.stock,
    });
    router.push(ROUTES.ORDERS);
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-danger-500">{error || 'Producto no encontrado'}</p>
          <Link href={ROUTES.PRODUCTS}>
            <Button variant="primary" size="md" className="mt-4">
              Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sellerId = typeof selectedProduct.seller === 'object' ? selectedProduct.seller.id : selectedProduct.seller;
  const isOwner = user?.id === sellerId;

  return (
    <div className="max-w-5xl">
      {/* Back Button */}
      <Link href={ROUTES.PRODUCTS}>
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Productos
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="h-96 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
          <Package className="h-24 w-24 text-gray-600" />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">{selectedProduct.name}</h1>
          <p className="text-gray-400 mb-6">{selectedProduct.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Precio</span>
              <span className="text-3xl font-bold text-primary-400">{formatPrice(selectedProduct.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Stock disponible</span>
              <span className="text-lg font-semibold text-gray-100">{selectedProduct.stock} unidades</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vendedor</span>
              <span className="flex items-center gap-2 text-gray-100">
                <User className="h-4 w-4" />
                {typeof selectedProduct.seller === 'object' ? selectedProduct.seller.username : 'N/A'}
              </span>
            </div>
          </div>

          {!isOwner && selectedProduct.stock > 0 && (
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Agregar al Carrito
            </Button>
          )}

          {selectedProduct.stock === 0 && (
            <div className="p-4 bg-danger-600/20 border border-danger-600 rounded-lg text-center">
              <p className="font-medium text-danger-500">Producto Agotado</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="mt-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Información Adicional</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Publicado</p>
            <p className="text-gray-100 mt-1">{selectedProduct.createdAt ? formatDateTime(selectedProduct.createdAt) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Última actualización</p>
            <p className="text-gray-100 mt-1">{selectedProduct.updatedAt ? formatDateTime(selectedProduct.updatedAt) : 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
