import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getAllSlugs } from '@/lib/products'
import ProductDetail from './ProductDetail'

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

  return <ProductDetail product={product} />
}
