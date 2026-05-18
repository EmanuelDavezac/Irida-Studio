import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id, approved } = await req.json()
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  if (approved === false) {
    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ deleted: true })
  }

  const review = await prisma.review.update({
    where: { id },
    data: { approved: true },
  })
  return NextResponse.json(review)
}
