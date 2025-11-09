/**
 * Products Hook
 * Custom hook for managing products state
 * 
 * TODO: Implement hook logic using Zustand store and API calls
 */

'use client';

import { useProductStore } from '@/store/productStore';

export const useProducts = () => {
  // TODO: Implement useProducts hook
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
