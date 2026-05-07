import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminDeleteButton from './AdminDeleteButton'
import { CATEGORY_LABELS } from '@/types'
import type { Category } from '@/types'

export default async function AdminPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-foreground">Productos ({products.length})</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-1" /> Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Producto</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Categoría</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Precio</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Stock</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Destacado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    )}
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {CATEGORY_LABELS[p.category as Category] ?? p.category}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {p.price ? `$${p.price.toLocaleString('es-AR')}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.inStock ? 'En stock' : 'Sin stock'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {p.featured ? '★' : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <AdminDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No hay productos todavía.{' '}
                  <Link href="/admin/productos/nuevo" className="underline">
                    Creá el primero
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
