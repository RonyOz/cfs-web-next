'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, User, Package, MapPin, X } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useAuth, useProducts, useOrders } from '@/lib/hooks';
import { ROUTES } from '@/config/constants';
import { formatPrice, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuth();
  const { selectedProduct, loading, fetchProductById, setSelectedProduct } = useProducts();
  const { createOrder } = useOrders();
  const [error, setError] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [showMeetingPlaceModal, setShowMeetingPlaceModal] = useState(false);
  const [meetingPlace, setMeetingPlace] = useState('');
  const [meetingPlaceError, setMeetingPlaceError] = useState('');

  useEffect(() => {
    params.then(p => setProductId(p.id));
  }, [params]);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !productId) {
      if (!_hasHydrated) return;
      if (!isAuthenticated) router.push(ROUTES.AUTH);
      return;
    }
    loadProduct();
    
    return () => {
      setSelectedProduct(null);
    };
  }, [isAuthenticated, productId]);

  const loadProduct = async () => {
    try {
      setError('');
      await fetchProductById(productId);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el producto');
    }
  };

  const handleBuyNowClick = () => {
    if (!selectedProduct || purchasing) return;
    
    if (quantity <= 0 || quantity > selectedProduct.stock) {
      toast.error('Cantidad inválida', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
    
    setShowMeetingPlaceModal(true);
  };

  const handleBuyNow = async () => {
    setMeetingPlaceError('');
    
    // Validar meetingPlace
    if (!meetingPlace.trim()) {
      setMeetingPlaceError('El lugar de encuentro es obligatorio');
      return;
    }
    if (meetingPlace.length > 255) {
      setMeetingPlaceError('El lugar de encuentro no puede exceder 255 caracteres');
      return;
    }
    
    try {
      setPurchasing(true);
      await createOrder({
        items: [
          {
            productId: selectedProduct!.id,
            quantity: quantity,
          },
        ],
        meetingPlace: meetingPlace.trim(),
      });
      toast.success('Orden creada exitosamente', {
        duration: 3000,
        position: 'top-center',
      });
      setShowMeetingPlaceModal(false);
      setMeetingPlace('');
      router.push(ROUTES.ORDERS);
    } catch (err: any) {
      toast.error(err.message || 'Error al crear la orden', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setPurchasing(false);
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > selectedProduct!.stock) return;
    setQuantity(newQuantity);
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg text-danger-500">{error || 'Producto no encontrado'}</p>
          <Link href={ROUTES.PRODUCTS}>
            <Button variant="primary" size="md" className="mt-4">
              Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sellerId = typeof selectedProduct.seller === 'object' ? selectedProduct.seller.id : selectedProduct.seller;
  const isOwner = user?.id === sellerId;

  return (
    <div className="max-w-5xl">
      {/* Back Button */}
      <Link href={ROUTES.PRODUCTS}>
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Productos
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="h-96 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
          <Package className="h-24 w-24 text-gray-600" />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">{selectedProduct.name}</h1>
          <p className="text-gray-400 mb-6">{selectedProduct.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Precio</span>
              <span className="text-3xl font-bold text-primary-400">{formatPrice(selectedProduct.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Stock disponible</span>
              <span className="text-lg font-semibold text-gray-100">{selectedProduct.stock} unidades</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vendedor</span>
              <span className="flex items-center gap-2 text-gray-100">
                <User className="h-4 w-4" />
                {typeof selectedProduct.seller === 'object' ? selectedProduct.seller.username : 'N/A'}
              </span>
            </div>
          </div>

          {!isOwner && selectedProduct.stock > 0 && (
            <>
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold text-gray-100 min-w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= selectedProduct.stock}
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-400">
                    (Disponibles: {selectedProduct.stock})
                  </span>
                </div>
              </div>
              
              {/* Total Price */}
              <div className="mb-6 p-4 bg-dark-800 rounded-lg border border-dark-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total a pagar</span>
                  <span className="text-2xl font-bold text-primary-400">
                    {formatPrice(selectedProduct.price * quantity)}
                  </span>
                </div>
              </div>
              
              {/* Buy Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={handleBuyNowClick}
                disabled={purchasing}
              >
                <ShoppingCart className="h-5 w-5" />
                Comprar Ahora
              </Button>
            </>
          )}

          {selectedProduct.stock === 0 && (
            <div className="p-4 bg-danger-600/20 border border-danger-600 rounded-lg text-center">
              <p className="font-medium text-danger-500">Producto Agotado</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="mt-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Información Adicional</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Publicado</p>
            <p className="text-gray-100 mt-1">{selectedProduct.createdAt ? formatDateTime(selectedProduct.createdAt) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Última actualización</p>
            <p className="text-gray-100 mt-1">{selectedProduct.updatedAt ? formatDateTime(selectedProduct.updatedAt) : 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Meeting Place Modal */}
      {showMeetingPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-400" />
                Lugar de Encuentro
              </h2>
              <button
                onClick={() => {
                  setShowMeetingPlaceModal(false);
                  setMeetingPlace('');
                  setMeetingPlaceError('');
                }}
                className="text-gray-400 hover:text-gray-100 transition-colors"
                disabled={purchasing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Indica el lugar donde deseas recibir tu pedido
            </p>

            <Input
              label="Lugar de Encuentro"
              placeholder="Ej: Edificio 320, Salón 201"
              value={meetingPlace}
              onChange={(e) => setMeetingPlace(e.target.value)}
              error={meetingPlaceError}
              disabled={purchasing}
              maxLength={255}
              prefixIcon={<MapPin className="h-4 w-4" />}
            />

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMeetingPlaceModal(false);
                  setMeetingPlace('');
                  setMeetingPlaceError('');
                }}
                disabled={purchasing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleBuyNow}
                disabled={purchasing}
                className="flex-1"
              >
                {purchasing ? 'Procesando...' : 'Confirmar Compra'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
