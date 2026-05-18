import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where: { productSlug: slug, approved: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { productSlug, name, rating, comment } = body

  if (!productSlug || !name?.trim() || !comment?.trim()) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating inválido' }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      productSlug,
      name: name.trim().slice(0, 60),
      rating: Math.round(rating),
      comment: comment.trim().slice(0, 1000),
      approved: false,
    },
  })
  return NextResponse.json(review, { status: 201 })
}
