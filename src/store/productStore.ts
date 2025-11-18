'use client';

import { create } from 'zustand';
import { Product, ProductFormData, ProductFilters } from '@/types';
import { 
  getProducts, 
  getProductById, 
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  PaginationParams 
} from '@/lib/api';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ProductFilters) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  
  // API Actions
  fetchProducts: (filters?: ProductFilters, pagination?: PaginationParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<void>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {},
  currentPage: 1,
  itemsPerPage: 9,
  hasMore: true,

  // State setters
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),

  fetchProducts: async (filters, pagination) => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts(filters, pagination);
      const hasMore = products.length === (pagination?.limit || 9);
      set({ products, hasMore, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar productos', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await getProductById(id);
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar producto', loading: false });
      throw error;
    }
  },

  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const product = await apiCreateProduct(data);
      set((state) => ({
        products: [...state.products, product],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error al crear producto', loading: false });
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await apiUpdateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        selectedProduct: state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error al actualizar producto', loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Error al eliminar producto', loading: false });
      throw error;
    }
  },
}));
