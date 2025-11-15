'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { useOrders } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Cart = () => {
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    createOrder
  } = useOrders();

  const cartTotal = getCartTotal();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);

    try {
      // Validar que el carrito no esté vacío
      if (cart.length === 0) {
        toast.error('El carrito está vacío', {
          icon: '🛒',
          position: 'top-center',
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Procesando tu orden...', {
        position: 'top-center',
      });

      // Crear la orden
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success('¡Orden creada exitosamente!', {
        duration: 3000,
        icon: '🎉',
        position: 'top-center',
      });

      setTimeout(() => {
        router.push(ROUTES.ORDERS);
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al crear la orden';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-100">¿Vaciar carrito?</p>
            <p className="text-sm text-gray-400 mt-1">
              Se eliminarán todos los productos del carrito
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              clearCart();
              toast.dismiss(t.id);
              toast.success('Carrito vaciado', {
                icon: '🗑️',
                duration: 2000,
              });
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        maxWidth: '400px',
      },
    });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-100">¿Eliminar producto?</p>
            <p className="text-sm text-gray-400 mt-1">
              {productName} será removido del carrito
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              removeFromCart(productId);
              toast.dismiss(t.id);
              toast.success('Producto eliminado', {
                icon: '✓',
                duration: 2000,
              });
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        maxWidth: '400px',
      },
    });
  };

  const handleQuantityChange = (productId: string, newQuantity: number, stock: number, productName: string) => {
    if (newQuantity < 1) return;

    if (newQuantity > stock) {
      toast.error(`Solo hay ${stock} unidades disponibles de ${productName}`, {
        icon: '📦',
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    updateCartItemQuantity(productId, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-300 mb-2">Tu carrito está vacío</p>
          <p className="text-gray-500 mb-6">Agrega productos para comenzar tu orden</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(ROUTES.HOME)}
          >
            Explorar Productos
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">
          Carrito de Compras
        </h2>
        <div className="text-sm text-gray-400">
          {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-danger-600/20 border border-danger-600 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-danger-500 shrink-0 mt-0.5" />
          <p className="text-sm text-danger-400">{error}</p>
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 bg-dark-700/50 border border-dark-600 rounded-lg hover:border-primary-500/50 transition-colors">
            {/* Product Image Placeholder */}
            <div className="w-20 h-20 bg-dark-600 rounded-lg shrink-0 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100 mb-1">{item.productName}</h3>
              <p className="text-sm text-gray-400">
                {formatPrice(item.price)} <span className="text-gray-500">c/u</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Stock disponible: {item.stock}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-dark-800 px-3 py-2 rounded-lg border border-dark-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.stock, item.productName)}
                disabled={item.quantity <= 1}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <span className="w-8 text-center font-semibold text-gray-100">{item.quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.stock, item.productName)}
                disabled={item.quantity >= item.stock}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-28">
              <p className="font-bold text-primary-400 text-lg">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(item.productId, item.productName)}
              className="text-danger-500 hover:text-danger-400 hover:bg-danger-500/10 h-8 w-8 p-0"
              title="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-dark-600 pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-300">Total</span>
          <span className="text-3xl font-bold text-primary-400">
            {formatPrice(cartTotal)}
          </span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleClearCart}
            disabled={isCheckingOut}
          >
            Vaciar Carrito
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
