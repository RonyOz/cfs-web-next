'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductFormData } from '@/types';
import { Button, Input, Card } from '@/components/ui';
import { useProducts, useImageUpload } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product | null;
}

export const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const { createProduct, updateProduct } = useProducts();
  const { uploadImage, uploading: uploadingImage, progress } = useImageUpload();
  const isEditMode = !!product;
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.imageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Formato de imagen no válido. Usa JPG, PNG, GIF o WEBP');
        return;
      }

      // Validar tamaño (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar 5MB');
        return;
      }

      setFile(selectedFile);
      
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setFormData(prev => ({ ...prev, imageUrl: undefined }));
    
    // Limpiar el input de archivo también
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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

    console.log('📦 [ProductForm] Iniciando envío del formulario...');
    console.log('📦 [ProductForm] Modo:', isEditMode ? 'EDICIÓN' : 'CREACIÓN');
    console.log('📦 [ProductForm] Datos del formulario:', formData);
    console.log('📦 [ProductForm] ¿Hay archivo nuevo?:', !!file);
    if (file) {
      console.log('📦 [ProductForm] Información del archivo:', {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type
      });
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // Si hay una nueva imagen, subirla primero
      if (file) {
        console.log('🖼️ [ProductForm] Iniciando subida de imagen...');
        toast.loading('Subiendo imagen...', { id: 'upload-image' });
        
        const result = await uploadImage(file);
        
        console.log('✅ [ProductForm] Imagen subida correctamente');
        console.log('✅ [ProductForm] URL resultante:', result.publicUrl);
        
        imageUrl = result.publicUrl;
        toast.success('Imagen subida exitosamente', { id: 'upload-image' });
      } else {
        console.log('ℹ️ [ProductForm] No hay archivo nuevo, usando URL existente:', imageUrl);
      }

      // Crear o actualizar producto con la URL de la imagen
      const productData = { ...formData, imageUrl };
      console.log('💾 [ProductForm] Datos finales del producto:', productData);

      if (isEditMode && product) {
        console.log('🔄 [ProductForm] Actualizando producto ID:', product.id);
        await updateProduct(product.id, productData);
        console.log('✅ [ProductForm] Producto actualizado exitosamente');
        toast.success('Producto actualizado exitosamente');
      } else {
        console.log('➕ [ProductForm] Creando nuevo producto...');
        await createProduct(productData);
        console.log('✅ [ProductForm] Producto creado exitosamente');
        toast.success('Producto creado exitosamente');
      }
      
      console.log('🎉 [ProductForm] Redirigiendo a lista de productos...');
      router.push(ROUTES.PRODUCTS);
    } catch (err: any) {
      console.error('❌ [ProductForm] Error en el proceso:', err);
      console.error('❌ [ProductForm] Tipo de error:', err?.constructor?.name);
      console.error('❌ [ProductForm] err.response:', err?.response);
      console.error('❌ [ProductForm] err.message:', err?.message);
      
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al guardar el producto';
      console.error('❌ [ProductForm] Mensaje final de error:', errorMessage);
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 [ProductForm] Proceso finalizado');
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
            label="Precio (COP)"
            name="price"
            type="number"
            step="1"
            min="0"
            placeholder="0"
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

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Imagen del Producto <span className="text-gray-500">(opcional)</span>
          </label>
          
          {preview ? (
            <div className="relative">
              <div className="w-full h-48 bg-dark-700 rounded-lg overflow-hidden mb-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Remover Imagen
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-700 rounded-lg cursor-pointer hover:border-primary-400 transition-colors bg-dark-900"
              >
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">Click para subir imagen</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF o WEBP (Max 5MB)</p>
              </label>
            </div>
          )}

          {uploadingImage && (
            <div className="mt-2">
              <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-400 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Subiendo imagen... {progress}%
              </p>
            </div>
          )}
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
