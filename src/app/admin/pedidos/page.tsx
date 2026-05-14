import { prisma } from '@/lib/prisma'
import type { OrderStatus } from '@prisma/client'

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Pendiente',
  PAID:      'Pagado',
  PREPARING: 'En preparación',
  SHIPPED:   'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  PAID:      'bg-emerald-100 text-emerald-700',
  PREPARING: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { OrderItem: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-foreground">
          Pedidos ({orders.length})
        </h1>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Número</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Cliente</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Entrega</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Total</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Ítems</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-foreground">{order.number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{order.buyerName}</div>
                  <div className="text-xs text-muted-foreground">{order.buyerEmail}</div>
                  <div className="text-xs text-muted-foreground">{order.buyerPhone}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.shippingMethod === 'retiro' ? (
                    <span className="text-xs">Retiro en local</span>
                  ) : (
                    <div className="text-xs">
                      <div>{order.address}</div>
                      <div>{order.postalCode} {order.city}, {order.province}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  ${order.total.toLocaleString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CLASS[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {order.createdAt.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                  <br />
                  {order.createdAt.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {order.OrderItem.map((item) => (
                    <div key={item.id}>
                      {item.productName}
                      {item.variantName ? ` — ${item.variantName}` : ''} ×{item.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
