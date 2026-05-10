'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, Variant } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import IriEyebrow from '@/components/ui/IriEyebrow'
import { ProductTile, type PlaceholderKind, type Tone } from '@/components/products/placeholders'

const categoryToKind: Record<string, PlaceholderKind> = {
  agenditas: 'agenda', stickers: 'stickers', llaveros: 'keychain',
  fotitos: 'fotitos', cumpleanos: 'topper', albumes: 'cuaderno',
  emprendimiento: 'tag', 'a-pintar': 'notebook',
}
const categoryToTone: Record<string, Tone> = {
  agenditas: 'beige', stickers: 'cream', llaveros: 'paper',
  fotitos: 'beige', cumpleanos: 'paper', albumes: 'sage',
}

const COLOR_SWATCHES: Record<string, string> = {
  crema: '#F6EFE2', cream: '#F6EFE2', blush: '#E8C9B5',
  sage: '#C8D4B5', tinta: '#1A1612', negro: '#1A1612',
  blanco: '#FFFFFF', beige: '#ECE0CB', dorado: '#8B6914',
  natural: '#F6EFE2', nude: '#E8C9B5',
}

function Stars({ value = 5, size = 12 }: { value?: number; size?: number }) {
  return (
    <span className="inline-flex gap-px text-ir-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12"
          fill={i < value ? 'currentColor' : 'transparent'}
          stroke="currentColor" strokeWidth="0.8">
          <path d="M 6 1 L 7.4 4.4 L 11 4.6 L 8.2 7 L 9.1 10.6 L 6 8.7 L 2.9 10.6 L 3.8 7 L 1 4.6 L 4.6 4.4 Z" />
        </svg>
      ))}
    </span>
  )
}

export default function ProductDetail({ product }: { product: Product }) {
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0]
  )
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'detalle' | 'envío' | 'reseñas'>('detalle')
  const [added, setAdded] = useState(false)

  const { addItem, openCart } = useCartStore()

  const price = selectedVariant?.price ?? product.price ?? 0
  const canBuy = price > 0 && product.inStock
  const hasImages = product.images.length > 0
  const galleryFrames = hasImages ? product.images.length : 4

  const kind = categoryToKind[product.category] ?? 'notebook'
  const tone = categoryToTone[product.category] ?? 'cream'

  const whatsappText = encodeURIComponent(
    `Hola! Me interesa: ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}`
  )

  function handleAdd() {
    if (!canBuy) return
    addItem(product, selectedVariant, qty)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  /* Split "Nombre · Subtítulo" into two lines for the heading */
  const [titleMain, titleSub] = product.name.includes('·')
    ? [product.name.split('·')[0].trim(), product.name.split('·').slice(1).join('·').trim()]
    : [product.name, null]

  return (
    /* Desktop: 2-col grid (gallery | info+tabs). Mobile: single col. */
    <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:items-start lg:max-w-5xl lg:mx-auto">

      {/* ── LEFT COL: gallery ──────────────────────── */}
      <div>
        {/* Main image — full-bleed on mobile, normal on desktop */}
        <div className="-mt-14 lg:mt-0 relative" style={{ height: 460 }}>
          {hasImages ? (
            <Image
              src={product.images[galleryIdx] ?? product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <ProductTile kind={kind} tone={tone} />
          )}

          {/* Out-of-stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-ir-cream/60 flex items-center justify-center">
              <span className="bg-ir-ink text-ir-cream text-[11px] tracking-[0.18em] uppercase px-4 py-2 font-sans">
                Sin stock
              </span>
            </div>
          )}

          {/* Pagination dots */}
          {galleryFrames > 1 && (
            <div className="absolute bottom-[22px] left-0 right-0 flex justify-center gap-1.5">
              {Array.from({ length: galleryFrames }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  aria-label={`Imagen ${i + 1}`}
                  className="border-0 rounded-pill transition-all duration-[250ms]"
                  style={{
                    width: i === galleryIdx ? 18 : 6,
                    height: 6,
                    background: i === galleryIdx
                      ? '#1A1612'
                      : 'rgba(26,22,18,0.25)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* Zoom hint */}
          <div className="absolute top-20 right-4 w-9 h-9 rounded-full bg-ir-cream/85 backdrop-blur-[6px] grid place-items-center pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="6" cy="6" r="4.5" />
              <line x1="9.5" y1="9.5" x2="13" y2="13" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Thumbnail strip */}
        {galleryFrames > 1 && (
          <div className="flex gap-2 px-5 pt-3 overflow-x-auto scrollbar-hide">
            {Array.from({ length: galleryFrames }).map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIdx(i)}
                className="shrink-0 overflow-hidden"
                style={{
                  width: 60, height: 60, padding: 0,
                  border: i === galleryIdx
                    ? '1.5px solid #1A1612'
                    : '1px solid #E4D9C4',
                  background: 'transparent', cursor: 'pointer',
                }}
              >
                {hasImages && product.images[i] ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[i]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </div>
                ) : (
                  <ProductTile kind={kind} tone={tone} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tabs — only shown in left col on desktop */}
        <div className="hidden lg:block px-[22px] pt-8 pb-6 border-t border-ir-line mt-6">
          <TabBar tab={tab} setTab={setTab} />
          <div className="mt-4">
            <TabContent tab={tab} product={product} />
          </div>
        </div>
      </div>

      {/* ── RIGHT COL: info ────────────────────────── */}
      <div>
        {/* Info block */}
        <section className="px-[22px] pt-6 pb-[18px] lg:pt-10">
          <IriEyebrow>
            {CATEGORY_LABELS[product.category]} · Colección Irida
          </IriEyebrow>

          <h1
            className="font-serif font-normal mt-2.5 mb-1.5"
            style={{ fontSize: 36, lineHeight: 1 }}
          >
            {titleMain}
            {titleSub && (
              <>
                <br />
                <em className="text-ir-gold">{titleSub}</em>
              </>
            )}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mt-2.5">
            <Stars value={5} />
            <span className="text-[11px] text-ir-mute font-sans">(48 reseñas)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-[18px]">
            {price > 0 ? (
              <span className="font-serif italic text-ir-gold" style={{ fontSize: 32 }}>
                {formatPrice(price)}
              </span>
            ) : (
              <span className="font-serif italic text-ir-mute text-[18px]">
                Precio a consultar
              </span>
            )}
          </div>
          {price > 0 && (
            <span className="block text-[11px] text-ir-mute font-sans mt-1">
              3 cuotas sin interés de {formatPrice(Math.round(price / 3))}
            </span>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-[22px]">
              <IriEyebrow className="mb-2.5">Color de tapa</IriEyebrow>
              <div className="flex gap-2.5 mt-2.5 flex-wrap">
                {product.variants.map((v) => {
                  const swatch = COLOR_SWATCHES[v.name.toLowerCase()]
                  const active = selectedVariant?.id === v.id
                  if (swatch) {
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        aria-label={v.name}
                        title={v.name}
                        className="rounded-full transition-all"
                        style={{
                          width: 38, height: 38, padding: 0, cursor: 'pointer',
                          background: swatch,
                          border: active ? '1.5px solid #1A1612' : '1px solid #E4D9C4',
                          outline: active ? '2px solid #FBF7F0' : 'none',
                          outlineOffset: -4,
                        }}
                      />
                    )
                  }
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        'px-4 py-1.5 rounded-pill text-[13px] font-sans border transition-all',
                        active
                          ? 'bg-ir-ink text-ir-cream border-ir-ink'
                          : 'bg-transparent text-ir-ink border-ir-line hover:border-ir-ink'
                      )}
                    >
                      {v.name}
                    </button>
                  )
                })}
              </div>
              {selectedVariant && (
                <p className="mt-2.5 text-[12px] font-serif italic m-0">
                  {selectedVariant.name}
                </p>
              )}
            </div>
          )}

          {/* Qty + CTA */}
          <div className="flex gap-2.5 items-stretch mt-[26px]">
            <div
              className="flex items-center border border-ir-line rounded-pill bg-white"
              style={{ padding: '0 4px' }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-11 border-0 bg-transparent text-[16px] grid place-items-center hover:text-ir-gold transition-colors"
                aria-label="Quitar uno"
              >−</button>
              <span className="min-w-[22px] text-center text-[14px] font-sans select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-11 border-0 bg-transparent text-[16px] grid place-items-center hover:text-ir-gold transition-colors"
                aria-label="Agregar uno"
              >+</button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!canBuy}
              className={cn(
                'flex-1 h-11 rounded-pill text-[13px] font-sans font-medium tracking-[0.02em] transition-colors',
                canBuy
                  ? added
                    ? 'bg-ir-gold text-ir-cream'
                    : 'bg-ir-ink text-ir-cream hover:bg-ir-gold'
                  : 'bg-ir-line text-ir-mute cursor-not-allowed'
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center gap-1.5"
                  >
                    ✓ Agregado
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center gap-1.5"
                  >
                    {canBuy ? (
                      <>
                        Agregar al carrito
                        {price > 0 && (
                          <span className="opacity-60">
                            · {formatPrice(price * qty)}
                          </span>
                        )}
                      </>
                    ) : 'Sin stock'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Fav + Consult */}
          <div className="flex gap-4 mt-4 justify-center">
            <button className="bg-transparent border-0 text-ir-mute text-[11px] tracking-[0.14em] uppercase font-sans flex gap-1.5 items-center hover:text-ir-ink transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" fill="none" strokeWidth="1.2">
                <path d="M 6 3 C 4 0 0 2 1 5 C 1.5 7.5 6 10 6 10 C 6 10 10.5 7.5 11 5 C 12 2 8 0 6 3 Z"/>
              </svg>
              Guardar
            </button>
            <a
              href={`https://wa.me/5493496567541?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-0 text-ir-mute text-[11px] tracking-[0.14em] uppercase font-sans flex gap-1.5 items-center hover:text-ir-ink transition-colors"
            >
              ⌁ Consultar
            </a>
          </div>
        </section>

        {/* Tabs — mobile only (shown in right col on desktop via left-col above) */}
        <section className="lg:hidden px-[22px] pt-5 pb-4 border-t border-ir-line">
          <TabBar tab={tab} setTab={setTab} />
          <div className="mt-4">
            <TabContent tab={tab} product={product} />
          </div>
        </section>
      </div>

    </div>
  )
}

/* ── Shared tab primitives ─────────────────────────────── */

function TabBar({
  tab,
  setTab,
}: {
  tab: string
  setTab: (t: 'detalle' | 'envío' | 'reseñas') => void
}) {
  return (
    <div className="flex gap-[22px]">
      {(['detalle', 'envío', 'reseñas'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className="border-0 bg-transparent text-[11px] tracking-[0.18em] uppercase font-sans transition-all"
          style={{
            color: tab === t ? '#1A1612' : '#6B6157',
            borderBottom: tab === t ? '1px solid #1A1612' : '1px solid transparent',
            padding: '4px 0',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function Stars2({ value = 5, size = 11 }: { value?: number; size?: number }) {
  return (
    <span className="inline-flex gap-px text-ir-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12"
          fill={i < value ? 'currentColor' : 'transparent'}
          stroke="currentColor" strokeWidth="0.8">
          <path d="M 6 1 L 7.4 4.4 L 11 4.6 L 8.2 7 L 9.1 10.6 L 6 8.7 L 2.9 10.6 L 3.8 7 L 1 4.6 L 4.6 4.4 Z" />
        </svg>
      ))}
    </span>
  )
}

function TabContent({ tab, product }: { tab: string; product: Product }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {tab === 'detalle' && (
        <motion.div
          key="detalle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {product.description && (
            <p className="font-serif italic text-ir-ink-soft text-[16px] leading-[1.5] mb-3 m-0">
              {product.description}
            </p>
          )}
          {product.shortDescription && (
            <p className="font-sans text-[13px] text-ir-mute leading-relaxed m-0 mt-2">
              {product.shortDescription}
            </p>
          )}
          {!product.description && !product.shortDescription && (
            <p className="font-serif italic text-ir-mute text-[15px] m-0">
              Papelería pensada en cada doblez. Pequeños lotes, papel marfil, dorado mate.
            </p>
          )}
        </motion.div>
      )}

      {tab === 'envío' && (
        <motion.div
          key="envío"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[13px] leading-[1.6]"
        >
          {[
            { label: 'Envío local · Esperanza (24-48 hs)', price: 1500 },
            { label: 'Envío estándar (3-5 días)',           price: 2400 },
            { label: 'Retiro en showroom',                  price: 0    },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={cn(
                'flex justify-between py-2.5',
                i < arr.length - 1 && 'border-b border-ir-line'
              )}
            >
              <span className="text-ir-ink-soft">{row.label}</span>
              <span className="font-serif italic text-ir-gold">
                {row.price === 0 ? 'Gratis' : formatPrice(row.price)}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-ir-mute mt-3 m-0">
            Devoluciones gratis los primeros 30 días.
          </p>
        </motion.div>
      )}

      {tab === 'reseñas' && (
        <motion.div
          key="reseñas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-3.5 text-[13px]"
        >
          {[
            { name: 'Sofía R.', comment: '"La calidad es increíble. El papel es divino, mejor que las japonesas."' },
            { name: 'Mateo L.', comment: '"La compré en blush, llegó perfecta y bien empaquetada. Ya pedí dos más."' },
          ].map(({ name, comment }) => (
            <div key={name}>
              <div className="flex items-center gap-2 mb-1">
                <Stars2 value={5} size={11} />
                <span className="font-sans font-medium text-ir-ink text-[13px]">{name}</span>
              </div>
              <p className="font-serif italic text-ir-ink-soft m-0">{comment}</p>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
