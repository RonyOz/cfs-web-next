/**
 * TODO: Implement cart item management (add, remove, update quantity)
 * TODO: Add checkout functionality
 * TODO: Validate business rules (stock, not own products)
 * TODO: Show error messages properly (no window.alert!)
 */

'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { useOrders } from '@/lib/hooks';

export const Cart = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // TODO: Get cart from order store
  // const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, createOrder } = useOrders();
  
  const cart: any[] = []; // Replace with actual cart
  const cartTotal = 0; // Replace with actual total

  // TODO: Implement checkout handler
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // TODO: Validate cart items
      // - Check stock availability
      // - Ensure not ordering own products
      
      // TODO: Create order
      // const orderData = {
      //   items: cart.map(item => ({
      //     productId: item.productId,
      //     quantity: item.quantity,
      //   })),
      // };
      // await createOrder(orderData);
      
      // TODO: Clear cart and show success message
      // clearCart();
    } catch (error) {
      // TODO: Show error message (no window.alert!)
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">Tu carrito está vacío</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Carrito de Compras
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item: any) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            {/* Product Image Placeholder */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.productName}</h3>
              <p className="text-sm text-gray-500">
                {formatPrice(item.price)} c/u
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Decrease quantity
                  // if (item.quantity > 1) {
                  //   updateCartItemQuantity(item.productId, item.quantity - 1);
                  // }
                }}
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Increase quantity (validate stock)
                  // if (item.quantity < item.stock) {
                  //   updateCartItemQuantity(item.productId, item.quantity + 1);
                  // }
                }}
              >
                +
              </Button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-20">
              <p className="font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // TODO: Remove from cart
                // removeFromCart(item.productId);
              }}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(cartTotal)}
          </span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // TODO: Clear cart with confirmation
              // clearCart();
            }}
          >
            Vaciar Carrito
          </Button>

          <Button
            variant="primary"
            className="flex-1"
            onClick={handleCheckout}
            isLoading={isCheckingOut}
          >
            Realizar Pedido
          </Button>
        </div>
      </div>
    </Card>
  );
};
