'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, cn } from '@/lib/utils'
import IriEyebrow from '@/components/ui/IriEyebrow'
import { ProductTile, type PlaceholderKind, type Tone } from '@/components/products/placeholders'


const categoryToKind: Record<string, PlaceholderKind> = {
  agenditas: 'agenda',    stickers: 'stickers', llaveros: 'keychain',
  fotitos:   'fotitos',   cumpleanos: 'topper', albumes: 'cuaderno',
  emprendimiento: 'tag',  'a-pintar': 'notebook',
}
const categoryToTone: Record<string, Tone> = {
  agenditas: 'beige', stickers: 'cream', llaveros: 'paper',
  fotitos:   'beige', cumpleanos: 'paper', albumes: 'sage',
}

function TotalsRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={cn('flex justify-between py-1 text-[13px] font-sans', muted ? 'text-ir-mute' : 'text-ir-ink')}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()

  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const subtotal  = items.reduce((s, i) => s + (i.variant?.price ?? i.product.price ?? 0) * i.quantity, 0)
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0
  const total     = subtotal - discount
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  function handleApplyCoupon() {
    if (coupon.trim().length > 1) setCouponApplied(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(26,22,18,0.45)' }}
            onClick={closeCart}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.2, 0.7, 0.3, 1], duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 z-50 bg-ir-cream flex flex-col"
            style={{
              width: '92%',
              maxWidth: 420,
              boxShadow: '-30px 0 60px -20px rgba(26,22,18,0.35)',
            }}
            aria-label="Tu carrito"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-[22px] pt-5 pb-4">
              <div>
                <IriEyebrow>
                  {itemCount === 1 ? '1 pieza' : `${itemCount} piezas`}
                </IriEyebrow>
                <h2
                  className="font-serif font-normal mt-1.5 m-0"
                  style={{ fontSize: 30, lineHeight: 1 }}
                >
                  Tu <em className="italic text-ir-gold">carrito.</em>
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="w-9 h-9 rounded-full grid place-items-center text-ir-ink hover:bg-ir-paper transition-colors border-0 bg-transparent text-[18px] leading-none"
              >
                ×
              </button>
            </div>

            <div className="border-b border-ir-line" />

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 py-16 px-8 text-center">
                  <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="#D8C4A4" strokeWidth="1.2">
                    <path d="M 3 5 L 6 5 L 7.5 14 L 17 14 L 18.5 7 L 6.5 7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="17.5" r="1.2" fill="#D8C4A4" stroke="none"/>
                    <circle cx="15" cy="17.5" r="1.2" fill="#D8C4A4" stroke="none"/>
                  </svg>
                  <div>
                    <p className="font-serif italic text-[18px] text-ir-ink mb-1 m-0">Carrito vacío</p>
                    <p className="font-sans text-[12px] text-ir-mute m-0">Explorá la tienda y encontrá algo especial.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 rounded-pill border border-ir-ink bg-transparent text-ir-ink text-[13px] font-sans tracking-[0.02em] hover:bg-ir-ink hover:text-ir-cream transition-colors"
                  >
                    <Link href="/tienda" onClick={closeCart}>Ver tienda</Link>
                  </button>
                </div>
              ) : (
                <>
                  {items.map((item) => {
                    const price    = item.variant?.price ?? item.product.price ?? 0
                    const kind     = categoryToKind[item.product.category] ?? 'notebook'
                    const tone     = categoryToTone[item.product.category] ?? 'cream'
                    const hasImage = !!item.product.images?.[0]

                    return (
                      <div
                        key={item.id}
                        className="grid gap-3.5 px-[22px] py-[18px] border-b border-ir-line"
                        style={{ gridTemplateColumns: '80px 1fr' }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="border border-ir-line overflow-hidden"
                          style={{ height: 96 }}
                        >
                          {hasImage ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <ProductTile kind={kind} tone={tone} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between gap-2">
                              <span className="font-serif text-[15px] leading-snug">
                                {item.product.name}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`Eliminar ${item.product.name}`}
                                className="shrink-0 bg-transparent border-0 text-[14px] text-ir-mute hover:text-ir-ink transition-colors leading-none h-[18px]"
                              >
                                ×
                              </button>
                            </div>
                            {item.variant && (
                              <p className="font-sans text-[11px] text-ir-mute mt-0.5 m-0">
                                {item.variant.name}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Qty pill */}
                            <div
                              className="inline-flex items-center border border-ir-line rounded-pill bg-white"
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Quitar uno"
                                className="border-0 bg-transparent text-[14px] grid place-items-center hover:text-ir-gold transition-colors"
                                style={{ width: 26, height: 28 }}
                              >−</button>
                              <span className="text-[12px] font-sans text-center select-none" style={{ width: 22 }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Agregar uno"
                                className="border-0 bg-transparent text-[14px] grid place-items-center hover:text-ir-gold transition-colors"
                                style={{ width: 26, height: 28 }}
                              >+</button>
                            </div>
                            {/* Price */}
                            <span className="font-serif italic text-ir-gold text-[16px]">
                              {formatPrice(price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Coupon */}
                  <div className="px-[22px] pt-5 pb-3">
                    <IriEyebrow className="mb-2">Cupón</IriEyebrow>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Código de descuento"
                        disabled={couponApplied}
                        className={cn(
                          'flex-1 px-3.5 py-2.5 text-[13px] font-sans bg-white border border-ir-line rounded-pill outline-none',
                          'focus:border-ir-gold focus:bg-white',
                          'placeholder:text-ir-mute/60 disabled:opacity-60'
                        )}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || coupon.trim().length < 2}
                        className={cn(
                          'px-4 py-2.5 rounded-pill border border-ir-line text-[13px] font-sans transition-colors',
                          'hover:bg-ir-paper disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-ir-ink'
                        )}
                      >
                        Aplicar
                      </button>
                    </div>
                    <AnimatePresence>
                      {couponApplied && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="mt-2.5 text-[12px] font-serif italic text-ir-gold m-0"
                        >
                          ✓ Cupón aplicado · 10% off
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* ── Totals + CTA ── */}
            {items.length > 0 && (
              <div className="border-t border-ir-line bg-ir-paper px-[22px] py-4">
                <TotalsRow label="Subtotal" value={formatPrice(subtotal)} muted />
                {discount > 0 && (
                  <TotalsRow label="Descuento" value={`− ${formatPrice(discount)}`} muted />
                )}

                <div className="border-t border-ir-line my-2.5" />

                <div className="flex items-baseline justify-between">
                  <span className="font-serif italic text-[16px] text-ir-ink">Total</span>
                  <span className="font-serif italic text-ir-gold text-[24px]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-3.5 flex items-center justify-center w-full h-11 rounded-pill bg-ir-ink text-ir-cream text-[13px] font-sans font-medium tracking-[0.02em] hover:bg-ir-gold transition-colors"
                >
                  Ir a checkout →
                </Link>

                <p className="mt-2.5 text-center text-[10px] font-sans text-ir-mute tracking-[0.14em] uppercase m-0">
                  Pago seguro · MercadoPago
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
