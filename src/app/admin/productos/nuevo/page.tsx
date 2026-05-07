import { prisma } from '@/lib/prisma'
import ProductForm from '@/app/admin/ProductForm'

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-8">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
