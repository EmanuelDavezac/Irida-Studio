'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { type PlaceholderKind, ProductTile } from '@/components/products/placeholders'
import type { Tone } from '@/components/products/placeholders'

interface HomeFeaturedCardProps {
  product: Product
  large?: boolean
  wide?: boolean
  placeholderKind?: PlaceholderKind
  placeholderTone?: Tone
}

export default function HomeFeaturedCard({
  product,
  large = false,
  wide = false,
  placeholderKind = 'notebook',
  placeholderTone = 'cream',
}: HomeFeaturedCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const price = product.price ?? 0
  const imgH = large ? 280 : 200

  const categoryLabel = {
    stickers:       'Stickers',
    agenditas:      'Agendas',
    cumpleanos:     'Cumpleaños',
    fotitos:        'Fotitos',
    llaveros:       'Llaveros',
    emprendimiento: 'Emprendimiento',
    albumes:        'Álbumes',
    'a-pintar':     '¡A pintar!',
  }[product.category] ?? product.category

  const Thumb = () =>
    product.images[0] ? (
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, 350px"
      />
    ) : (
      <ProductTile kind={placeholderKind} tone={placeholderTone} />
    )

  return (
    <div
      className="bg-white border border-ir-line overflow-hidden"
      style={{ display: wide ? 'flex' : 'block' }}
    >
      {/* Image */}
      <div
        className="relative"
        style={{
          height: wide ? 'auto' : imgH,
          width: wide ? 140 : '100%',
          flex: wide ? '0 0 140px' : 'initial',
        }}
      >
        <Link href={`/producto/${product.slug}`} className="block w-full h-full">
          <Thumb />
        </Link>
        {large && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-ir-cream text-[9px] tracking-[0.18em] text-ir-ink-soft font-sans">
            ★ MÁS VENDIDO
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] tracking-[0.18em] uppercase text-ir-mute font-sans">
          {categoryLabel}
        </span>
        <Link href={`/producto/${product.slug}`}>
          <span className="font-serif leading-[1.15]" style={{ fontSize: large ? 22 : 16 }}>
            {product.name}
          </span>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="font-serif italic text-ir-gold" style={{ fontSize: large ? 20 : 16 }}>
            {formatPrice(price)}
          </span>
          <button
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.name} al carrito`}
            className="w-8 h-8 rounded-full border border-ir-ink bg-transparent grid place-items-center hover:bg-ir-ink hover:text-ir-cream transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" fill="none" strokeWidth="1.4">
              <line x1="6" y1="2" x2="6" y2="10" />
              <line x1="2" y1="6" x2="10" y2="6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
