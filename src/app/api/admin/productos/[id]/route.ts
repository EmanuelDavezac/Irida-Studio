import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { name, price, shortDescription, description, category, images, featured, inStock, variants } = body

  await prisma.variant.deleteMany({ where: { productId: id } })

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
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

  return NextResponse.json(product)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
