import { prisma } from '@/lib/prisma'
import CategoriaManager from './CategoriaManager'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  let categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })

  if (categories.length === 0) {
    const defaults = [
      { slug: 'stickers', label: 'Stickers' },
      { slug: 'agenditas', label: 'Agenditas' },
      { slug: 'cumpleanos', label: 'Cumpleaños' },
      { slug: 'fotitos', label: 'Fotitos' },
      { slug: 'llaveros', label: 'Llaveros' },
      { slug: 'emprendimiento', label: 'Emprendimiento' },
      { slug: 'albumes', label: 'Álbumes' },
      { slug: 'a-pintar', label: '¡A pintar!' },
    ]
    await prisma.category.createMany({ data: defaults, skipDuplicates: true })
    categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-2">Categorías</h1>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        Gestioná las categorías que aparecen en la tienda y en el formulario de productos.
      </p>
      <CategoriaManager initial={categories} />
    </div>
  )
}
