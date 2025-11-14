'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductFormData } from '@/types';
import { Button, Input, Card } from '@/components/ui';
import { useProducts } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';

interface ProductFormProps {
  product?: Product | null;
}

export const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const { createProduct, updateProduct } = useProducts();
  const isEditMode = !!product;
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (formData.price <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    if (formData.stock < 0) {
      setError('El stock no puede ser negativo');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push(ROUTES.PRODUCTS);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-600/20 border border-danger-600 rounded-lg">
            <p className="text-sm text-danger-500">{error}</p>
          </div>
        )}

        <Input
          label="Nombre del Producto"
          name="name"
          type="text"
          placeholder="Ej: Sandwich de jamón"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            rows={4}
            placeholder="Describe tu producto..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (USD)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isLoading}
          >
            {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.PRODUCTS)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
