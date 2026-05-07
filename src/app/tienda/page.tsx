import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import CatalogClient from './CatalogClient'
import type { Category } from '@/types'

export const metadata: Metadata = {
  title: 'Tienda',
  description:
    'Explorá toda la colección de Irida Studio: stickers, agendas, álbumes, fotitos y más. Esperanza, Santa Fe.',
}

interface TiendaPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const { categoria } = await searchParams
  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-12">
          <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
            Colección
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground">
            La tienda
          </h1>
        </div>

        <CatalogClient
          products={products}
          initialCategory={categoria as Category | undefined}
        />
      </div>
    </div>
  )
}
