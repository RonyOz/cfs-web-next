'use client';

import { useProductStore } from '@/store/productStore';

export const useProducts = () => {
  const products = useProductStore((state) => state.products);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const setSelectedProduct = useProductStore((state) => state.setSelectedProduct);

  return {
    products,
    selectedProduct,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setSelectedProduct,
  };
};
