/**
 * ProductList Component
 * List component with pagination for displaying products
 * 
 * Academic Requirements:
 * - User Interface (15%): Pagination implementation
 * - Functionalities (20%): Product browsing
 * 
 * TODO: Implement pagination
 * TODO: Add loading state
 * TODO: Add empty state
 * TODO: Add filters (search, price range)
 */

'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFilters } from '@/types';
import { ProductCard } from './ProductCard';
import { Button, Input } from '@/components/ui';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  showActions = true,
}: ProductListProps) => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: Implement pagination logic
  const totalPages = Math.ceil(products.length / DEFAULT_PAGE_SIZE);
  const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
  const endIndex = startIndex + DEFAULT_PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // TODO: Implement filter logic
  const handleSearch = (search: string) => {
    setFilters({ ...filters, search });
    setCurrentPage(1);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <Input
          type="search"
          placeholder="Buscar productos..."
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* TODO: Add more filters (price range, seller, etc.) */}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
