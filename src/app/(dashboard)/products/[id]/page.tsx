/**
 * Product Detail Page
 * TODO: Implementar vista detallada del producto
 */

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Detalle del Producto</h1>
      <p className="text-gray-600">Product ID: {params.id}</p>
      {/* TODO: Fetch and display product details */}
      {/* TODO: Add "Add to Cart" button */}
      {/* TODO: Show seller information */}
    </div>
  );
}
