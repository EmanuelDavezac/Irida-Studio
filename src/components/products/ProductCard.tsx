'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (!product.price) return
    addItem(product)
    openCart()
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <Link href={`/producto/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <span className="font-serif text-4xl text-muted-foreground/30 italic">
                I
              </span>
            </div>
          )}

          {/* Quick add overlay */}
          {product.price && (
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          )}
          <button
            onClick={handleAddToCart}
            disabled={!product.price || !product.inStock}
            className="absolute bottom-3 right-3 bg-white text-foreground rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-foreground hover:text-background disabled:hidden"
            aria-label="Agregar al carrito"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          {!product.inStock && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary">Sin stock</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1 font-sans">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h3 className="font-serif text-base text-foreground leading-snug mb-2">
            {product.name}
          </h3>
          <p className="font-sans font-medium text-foreground">
            {product.price ? formatPrice(product.price) : 'Consultar precio'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
