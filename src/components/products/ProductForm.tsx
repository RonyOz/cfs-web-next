/**
 * TODO: Implement form logic with React Hook Form
 * TODO: Add Zod validation
 * TODO: Handle create and update modes
 * TODO: Show error messages properly (no window.alert!)
 */

'use client';

import { useEffect } from 'react';
import { Product, ProductFormData } from '@/types';
import { Button, Input } from '@/components/ui';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) => {
  const isEditMode = !!product;

  // TODO: Initialize React Hook Form
  // const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: product || {},
  // });

  // TODO: Reset form when product changes
  useEffect(() => {
    if (product) {
      // reset(product);
    }
  }, [product]);

  // TODO: Implement submit handler
  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      // Show success message
      // Reset form if creating new product
      if (!isEditMode) {
        // reset();
      }
    } catch (error) {
      // Show error message (no window.alert!)
    }
  };

  return (
    <form className="space-y-6">
      <Input
        label="Nombre del Producto"
        type="text"
        placeholder="Ej: Sandwich de jamón"
        // {...register('name')}
        // error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
          placeholder="Describe tu producto..."
          // {...register('description')}
        />
        {/* TODO: Show error message */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio (USD)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          // {...register('price', { valueAsNumber: true })}
          // error={errors.price?.message}
        />

        <Input
          label="Stock"
          type="number"
          min="0"
          placeholder="0"
          // {...register('stock', { valueAsNumber: true })}
          // error={errors.stock?.message}
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

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
