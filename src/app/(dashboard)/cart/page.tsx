'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Cart } from '@/components/orders';
import { ROUTES } from '@/config/constants';

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated, _hasHydrated } = useAuth();

    useEffect(() => {
        if (!_hasHydrated) return;
        
        if (!isAuthenticated) {
            router.push(ROUTES.AUTH);
        }
    }, [isAuthenticated, _hasHydrated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Carrito de Compras</h1>
                <p className="text-gray-400 mt-2">Revisa tus productos antes de realizar el pedido</p>
            </div>

            <Cart />
        </div>
    );
}
