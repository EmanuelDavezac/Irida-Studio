import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/auth'
import { Package, Plus, LogOut, Tag, ShoppingBag } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/login')

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif text-lg text-foreground">
            Irida Studio <span className="text-muted-foreground font-sans text-xs font-normal">admin</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Package className="h-4 w-4" />
              Productos
            </Link>
            <Link
              href="/admin/productos/nuevo"
              className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuevo
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Tag className="h-4 w-4" />
              Categorías
            </Link>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </Link>
          </nav>
        </div>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </form>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
