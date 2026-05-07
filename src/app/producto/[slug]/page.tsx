import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getProductBySlug,
  getAllSlugs,
  getProductsByCategory,
} from '@/lib/products'
import { CATEGORY_LABELS } from '@/types'
import ProductDetail from './ProductDetail'
import ProductCard from '@/components/products/ProductCard'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Irida Studio`,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-14">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground font-sans mb-10"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/tienda"
            className="hover:text-foreground transition-colors"
          >
            Tienda
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/tienda?categoria=${product.category}`}
            className="hover:text-foreground transition-colors"
          >
            {CATEGORY_LABELS[product.category]}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>

        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-24 pt-12 border-t border-border">
            <div className="mb-10">
              <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
                También te puede gustar
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-foreground">
                Más de {CATEGORY_LABELS[product.category]}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
