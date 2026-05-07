'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Minus, Plus, MessageCircle } from 'lucide-react'
import type { Product, Variant } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const { addItem, openCart } = useCartStore()

  const price = selectedVariant?.price ?? product.price
  const canBuy = (price !== null && price !== undefined) && product.inStock

  function handleAddToCart() {
    if (!canBuy) return
    addItem(product, selectedVariant, quantity)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2200)
  }

  const whatsappText = encodeURIComponent(
    `Hola! Me interesa: ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}`
  )

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* ── Image column ── */}
      <div className="space-y-3">
        <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden">
          {product.images[activeImage] ? (
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <PlaceholderImage />
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-1.5">
                Sin stock
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0',
                  activeImage === i ? 'border-foreground' : 'border-transparent'
                )}
                aria-label={`Imagen ${i + 1}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info column ── */}
      <div className="lg:py-2">
        <Badge variant="outline" className="mb-5">
          {CATEGORY_LABELS[product.category]}
        </Badge>

        <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-5">
          {product.name}
        </h1>

        <div className="mb-6">
          {price !== null && price !== undefined ? (
            <p className="font-serif text-2xl lg:text-3xl text-foreground">
              {formatPrice(price)}
            </p>
          ) : (
            <p className="font-sans text-lg text-muted-foreground italic">
              Precio a consultar
            </p>
          )}
        </div>

        <p className="font-sans text-muted-foreground leading-relaxed mb-8">
          {product.shortDescription}
        </p>

        <div className="w-10 h-px bg-border mb-8" />

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-7">
            <p className="font-sans text-sm font-medium text-foreground mb-3">
              Variante
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    'px-4 py-2 rounded-full font-sans text-sm border transition-all duration-150',
                    selectedVariant?.id === v.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  )}
                >
                  {v.name}
                  {v.price && product.price && v.price !== product.price && (
                    <span className="ml-1.5 opacity-50 text-xs">
                      +{formatPrice(v.price - product.price)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-8">
          <p className="font-sans text-sm font-medium text-foreground mb-3">
            Cantidad
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
              aria-label="Quitar uno"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="font-sans text-base w-8 text-center tabular-nums select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Agregar uno"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!canBuy}
            className={cn(
              'flex-1 sm:flex-none sm:min-w-56 transition-colors duration-200',
              added && 'bg-emerald-700 hover:bg-emerald-700'
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Agregado al carrito
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {canBuy ? 'Agregar al carrito' : 'Sin stock'}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <Button asChild variant="outline" size="lg">
            <a
              href={`https://wa.me/5493496567541?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar
            </a>
          </Button>
        </div>

        {/* Full description */}
        <div className="border-t border-border pt-8 space-y-4">
          <p className="font-sans text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Descripción
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function PlaceholderImage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
      <span className="font-serif text-9xl text-primary/15 italic select-none">
        I
      </span>
    </div>
  )
}
