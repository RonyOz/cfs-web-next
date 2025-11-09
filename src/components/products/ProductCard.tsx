/**
 * TODO: Add "Add to Cart" functionality
 * TODO: Show edit/delete buttons based on user role and ownership
 * TODO: Add product image support
 */

'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { Card, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  showActions = true,
}: ProductCardProps) => {
  // TODO: Get current user from auth store
  // const { user, isAdmin } = useAuth();
  
  // TODO: Check if current user is the owner
  // const isOwner = user?.id === product.seller.id;
  // const canEdit = isOwner || isAdmin;

  return (
    <Card hover className="h-full flex flex-col">
      {/* Product Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <p className="text-gray-500">Imagen del Producto</p>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock}
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Vendedor: {typeof product.seller === 'object' ? product.seller.username : 'N/A'}
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 flex gap-2">
          {/* TODO: Show "Add to Cart" only if not owner */}
          {onAddToCart && product.stock > 0 && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onAddToCart(product)}
            >
              Agregar al Carrito
            </Button>
          )}

          {/* TODO: Show edit/delete buttons only for owner or admin */}
          {/* {canEdit && ( */}
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </Button>
              )}
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
          {/* )} */}
        </div>
      )}

      {product.stock === 0 && (
        <div className="mt-2 p-2 bg-danger-50 rounded-lg text-center">
          <p className="text-sm text-danger-700 font-medium">Agotado</p>
        </div>
      )}
    </Card>
  );
};
