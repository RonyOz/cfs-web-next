'use client';
import { Header } from "@/components/layout";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { useProducts } from "@/lib/hooks";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Home() {

  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div className="min-h-screen bg-primary-bg">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-dark-700 bg-linear-to-r from-dark-800 to-dark-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-6xl">
              Toda la comida del campus
              <span className="block text-primary-400">en un solo lugar</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explora, pide o comparte comida cuando más la necesitas. Conecta con quienes tienen hambre, haz visible tu oferta y disfruta lo mejor del campus.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button variant="primary" size="lg">
                  Ver Productos
                </Button>
              </Link>
              <Link href={ROUTES.AUTH}>
                <Button variant="outline" size="lg">
                  Comenzar a Vender
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 bg-dark-900">

        {/* Products Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Todos los Productos</h2>
            <p className="mt-1 text-sm text-gray-400">{products.length} productos disponibles</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <h1>{product.name}</h1>
          ))}
        </div>
      </section>
    </div>
  );
}
