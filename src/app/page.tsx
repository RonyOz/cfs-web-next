'use client';
import { Header } from "@/components/layout";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { useAuth, useProducts } from "@/lib/hooks";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui";
import { Search, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/products";
import { useOrderStore } from "@/store";
import { Product } from "@/types";

const PRODUCTS_LIMIT = 6;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    products,
    loading,
    error,
    fetchProducts,
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const limitedProducts = useMemo(() =>
    filteredProducts.slice(0, PRODUCTS_LIMIT),
    [filteredProducts]
  );

  const handleViewMore = () => {
    router.push(ROUTES.PRODUCTS);
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <Header />

      {/* Hero Section - Search */}
      <section className="relative overflow-hidden border-b border-dark-700 bg-linear-to-r from-dark-800 to-dark-900">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-4 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl md:text-5xl">
              Toda la comida del campus
              <span className="block text-primary-400">en un solo lugar</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Explora, pide o comparte comida cuando más la necesitas. Conecta con quienes tienen hambre, haz visible tu oferta y disfruta lo mejor del campus.
            </p>
            <div className="mt-8">
              <Input
                prefixIcon={<Search className="h-5 w-5" />}
                placeholder="Buscar productos..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 bg-dark-900">
        {/* Products Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              {searchQuery ? 'Resultados de Búsqueda' : 'Productos Destacados'}
            </h2>
            {!loading && !error && (
              <p className="mt-1 text-sm text-gray-400">
                Mostrando {limitedProducts.length} de {products.length} productos
              </p>
            )}
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-400 border-r-transparent"></div>
              <p className="mt-4 text-gray-400">Cargando productos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-16">
            <div className="rounded-lg border border-danger-600 bg-danger-600/10 p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-danger-500" />
              <p className="mt-4 text-lg font-medium text-danger-500">{error}</p>
              <Button
                variant="danger"
                size="sm"
                className="mt-4"
                onClick={() => fetchProducts()}
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {limitedProducts.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {limitedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      showActions={true}
                    />
                  ))}
                </div>

                {/* View More Button */}
                {searchQuery && products.length > PRODUCTS_LIMIT && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleViewMore}
                    >
                      Ver Todos los Productos
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-lg text-gray-400">
                    {searchQuery
                      ? `No se encontraron productos para "${searchQuery}"`
                      : 'No hay productos disponibles'
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Ver todos los productos
                    </Button>
                  )}
                  {!searchQuery && isAuthenticated && (
                    <Link href={ROUTES.PRODUCTS}>
                      <Button variant="primary" size="sm" className="mt-4">
                        Publicar Producto
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
