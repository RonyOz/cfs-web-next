'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/products';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl">
      {/* Back Button */}
      <Link href={ROUTES.PRODUCTS}>
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Productos
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Crear Producto</h1>
        <p className="mt-1 text-gray-400">Publica un nuevo producto en el marketplace</p>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  );
}
