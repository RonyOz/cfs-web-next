'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth, useProducts } from '@/lib/hooks';
import { ProductForm } from '@/components/products';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/constants';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { selectedProduct, loading, fetchProductById, setSelectedProduct } = useProducts();
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    params.then(p => setProductId(p.id));
  }, [params]);

  useEffect(() => {
    if (!isAuthenticated || !productId) {
      if (!isAuthenticated) router.push(ROUTES.AUTH);
      return;
    }

    const loadProduct = async () => {
      try {
        await fetchProductById(productId);
      } catch (error) {
        router.push(ROUTES.PRODUCTS);
      }
    };

    loadProduct();

    // Cleanup: limpiar selectedProduct al desmontar
    return () => {
      setSelectedProduct(null);
    };
  }, [productId, isAuthenticated, router, fetchProductById, setSelectedProduct]);

  // Validar ownership después de cargar
  useEffect(() => {
    if (selectedProduct && user) {
      const sellerId = typeof selectedProduct.seller === 'object' 
        ? selectedProduct.seller.id 
        : selectedProduct.seller;
      
      if (sellerId !== user.id) {
        router.push(ROUTES.PRODUCTS);
      }
    }
  }, [selectedProduct, user, router]);

  if (!isAuthenticated || loading) return null;
  if (!selectedProduct) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-gray-100">Editar Producto</h1>
        <p className="text-gray-400 mt-2">
          Actualiza la información de tu producto
        </p>
      </div>

      <ProductForm product={selectedProduct} />
    </div>
  );
}
