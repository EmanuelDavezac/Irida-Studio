import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/app/admin/ProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { createdAt: 'asc' } }),
  ])
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-8">Editar: {product.name}</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          price: product.price,
          shortDescription: product.shortDescription,
          description: product.description,
          category: product.category,
          images: product.images,
          featured: product.featured,
          inStock: product.inStock,
        }}
      />
    </div>
  )
}
