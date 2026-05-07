import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { name, price, shortDescription, description, category, images, featured, inStock, variants } = body

  const slug = slugify(name)

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price: price ? Number(price) : null,
      shortDescription,
      description,
      category,
      images: images ?? [],
      featured: featured ?? false,
      inStock: inStock ?? true,
      variants: {
        create: (variants ?? []).map((v: { name: string; price?: number }) => ({
          name: v.name,
          price: v.price ? Number(v.price) : null,
        })),
      },
    },
    include: { variants: true },
  })

  return NextResponse.json(product, { status: 201 })
}
