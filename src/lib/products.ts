import { prisma } from '@/lib/prisma'
import type { Product, Category } from '@/types'

function mapProduct(p: {
  id: string
  name: string
  slug: string
  price: number | null
  shortDescription: string
  description: string | null
  category: string
  images: string[]
  featured: boolean
  inStock: boolean
  variants: { id: string; name: string; price: number | null }[]
}): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    shortDescription: p.shortDescription,
    description: p.description ?? '',
    category: p.category as Category,
    images: p.images,
    featured: p.featured,
    inStock: p.inStock,
    variants: p.variants.map((v) => ({ id: v.id, name: v.name, price: v.price })),
  }
}

const include = { variants: true } as const

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({ include, orderBy: { createdAt: 'asc' } })
  return products.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include,
    orderBy: { createdAt: 'asc' },
  })
  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { slug }, include })
  return product ? mapProduct(product) : undefined
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category },
    include,
    orderBy: { createdAt: 'asc' },
  })
  return products.map(mapProduct)
}

export async function getAllSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map((p) => p.slug)
}
