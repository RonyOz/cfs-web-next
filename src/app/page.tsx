import { Header } from "@/components/layout";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function Home() {
  // TODO: Fetch products from API
  // TODO: Implement filters functionality
  // TODO: Add loading states

  const categories = [
    "Todos",
    "Italiana",
    "Saludable",
    "Postres",
    "India",
    "Panadería",
    "Japonesa",
  ];

  // Mock data - replace with real API data
  const mockProducts = [
    {
      id: 1,
      name: "Pasta Carbonara Casera",
      seller: "Sarah Chen",
      location: "Campus Norte - Edificio A",
      time: "Hace 2 horas",
      price: 8.50,
      category: "Italiana",
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    },
    {
      id: 2,
      name: "Bowl Buddha Vegetariano",
      seller: "Mike Rodriguez",
      location: "Campus Sur - Residencia 3",
      time: "Hace 1 hora",
      price: 6.00,
      category: "Saludable",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    },
    {
      id: 3,
      name: "Galletas Chispas Chocolate (12 unidades)",
      seller: "Emma Watson",
      location: "Campus Oeste - Biblioteca",
      time: "Hace 30 minutos",
      price: 5.00,
      category: "Postres",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
    },
    {
      id: 4,
      name: "Chicken Tikka Masala",
      seller: "Raj Patel",
      location: "Campus Este - Cafetería",
      time: "Hace 4 horas",
      price: 9.00,
      category: "India",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    },
    {
      id: 5,
      name: "Croissants Recién Horneados (6 unidades)",
      seller: "Marie Dubois",
      location: "Campus Norte - Edificio C",
      time: "Hace 1 hora",
      price: 7.50,
      category: "Panadería",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    },
    {
      id: 6,
      name: "Plato de Sushi Rolls",
      seller: "Yuki Tanaka",
      location: "Campus Central - Centro Estudiantil",
      time: "Hace 3 horas",
      price: 12.00,
      category: "Japonesa",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
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
                <button className="rounded-lg bg-primary-400 px-6 py-3 text-sm font-semibold text-dark-900 shadow-sm hover:bg-primary-500 transition-colors">
                  Ver Productos
                </button>
              </Link>
              <Link href={ROUTES.SIGNUP}>
                <button className="rounded-lg border border-gray-700 bg-transparent px-6 py-3 text-sm font-semibold text-gray-100 hover:bg-gray-800 transition-colors">
                  Comenzar a Vender
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 bg-dark-900">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                className="whitespace-nowrap rounded-full border border-gray-700 bg-dark-800 px-4 py-2 text-sm font-medium text-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Todos los Productos</h2>
            <p className="mt-1 text-sm text-gray-400">{mockProducts.length} productos disponibles</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <Link
              key={product.id}
              href={`${ROUTES.PRODUCTS}/${product.id}`}
              className="group overflow-hidden rounded-lg border border-gray-800 bg-dark-800 transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-400/10"
            >
              {/* Product Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full bg-dark-900/80 px-3 py-1 text-xs font-medium text-primary-400 backdrop-blur-sm">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary-400 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-400">por {product.seller}</p>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {product.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {product.time}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-100">${product.price.toFixed(2)}</span>
                  <button className="rounded-lg bg-primary-400 px-4 py-2 text-sm font-semibold text-dark-900 hover:bg-primary-500 transition-colors">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
