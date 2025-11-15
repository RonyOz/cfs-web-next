'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, Button } from '@/components/ui';
import { formatPrice, cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/hooks';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onDelete,
  showActions = true,
}: ProductCardProps) => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const sellerId = typeof product.seller === 'object' ? product.seller.id : product.seller;
  const isOwner = user?.id === sellerId;
  const canEdit = isOwner || isAdmin;
  const canAddToCart = !isOwner && onAddToCart && product.stock > 0;

  return (
    <Card hover className="h-full flex flex-col">
      {/* Product Image Placeholder */}
      <div className="w-full h-48 bg-dark-700 rounded-lg mb-4 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Sin imagen</p>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
          <h3 className="text-lg font-semibold text-gray-100 hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-primary-400">
            {formatPrice(product.price)}
          </p>
          <p className={cn(
            "text-sm font-medium",
            product.stock > 0 ? "text-success-500" : "text-danger-500"
          )}>
            Stock: {product.stock}
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Vendedor: {typeof product.seller === 'object' ? product.seller.username : 'N/A'}
        </p>
      </div>

      {/* Stock Warning */}
      {product.stock === 0 && (
        <div className="mt-3 p-2 bg-danger-600/20 border border-danger-600 rounded-lg text-center">
          <p className="text-sm text-danger-500 font-medium">Agotado</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="mt-4 flex gap-2">
          {/* Add to Cart Button - Always visible if conditions are met */}
          {canAddToCart && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
              Agregar
            </Button>
          )}

          {/* Edit/Delete buttons for owner or admin */}
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                className={canAddToCart ? '' : 'flex-1'}
                onClick={() => router.push(`${ROUTES.PRODUCTS}/${product.id}/edit`)}
              >
                Editar
              </Button>
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  Eliminar
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
};
