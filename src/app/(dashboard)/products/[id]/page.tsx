'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, User, Package } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth, useProducts } from '@/lib/hooks';
import { useOrderStore } from '@/store';
import { ROUTES } from '@/config/constants';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Product } from '@/types';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { fetchProductById } = useProducts();
  const { addToCart } = useOrderStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }
    loadProduct();
  }, [isAuthenticated, params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(params.id);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
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

  if (error || !product) {
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

  const sellerId = typeof product.seller === 'object' ? product.seller.id : product.seller;
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
          <h1 className="text-3xl font-bold text-gray-100 mb-2">{product.name}</h1>
          <p className="text-gray-400 mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Precio</span>
              <span className="text-3xl font-bold text-primary-400">{formatPrice(product.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Stock disponible</span>
              <span className="text-lg font-semibold text-gray-100">{product.stock} unidades</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vendedor</span>
              <span className="flex items-center gap-2 text-gray-100">
                <User className="h-4 w-4" />
                {typeof product.seller === 'object' ? product.seller.username : 'N/A'}
              </span>
            </div>
          </div>

          {!isOwner && product.stock > 0 && (
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

          {product.stock === 0 && (
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
            <p className="text-gray-100 mt-1">{formatDateTime(product.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Última actualización</p>
            <p className="text-gray-100 mt-1">{formatDateTime(product.updatedAt)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
