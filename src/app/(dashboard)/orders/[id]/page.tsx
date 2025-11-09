/**
 * Order Detail Page
 * TODO: Implementar vista detallada de la orden
 */

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Detalle de la Orden</h1>
      <p className="text-gray-600">Order ID: {params.id}</p>
      {/* TODO: Fetch and display order details */}
      {/* TODO: Show order items */}
      {/* TODO: Add cancel button for pending orders */}
    </div>
  );
}
