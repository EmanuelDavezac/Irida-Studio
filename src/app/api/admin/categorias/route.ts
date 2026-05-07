import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const DEFAULT_CATEGORIES = [
  { slug: 'stickers', label: 'Stickers' },
  { slug: 'agenditas', label: 'Agenditas' },
  { slug: 'cumpleanos', label: 'Cumpleaños' },
  { slug: 'fotitos', label: 'Fotitos' },
  { slug: 'llaveros', label: 'Llaveros' },
  { slug: 'emprendimiento', label: 'Emprendimiento' },
  { slug: 'albumes', label: 'Álbumes' },
  { slug: 'a-pintar', label: '¡A pintar!' },
]

export async function GET() {
  let categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })

  if (categories.length === 0) {
    await prisma.category.createMany({ data: DEFAULT_CATEGORIES, skipDuplicates: true })
    categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })
  }

  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug, label } = await req.json()
  if (!slug || !label) {
    return NextResponse.json({ error: 'slug y label requeridos' }, { status: 400 })
  }

  const slugNormalized = slug.trim().toLowerCase().replace(/\s+/g, '-')

  try {
    const category = await prisma.category.create({ data: { slug: slugNormalized, label: label.trim() } })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'El slug ya existe' }, { status: 409 })
  }
}
