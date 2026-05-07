'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useCartTotal } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function CarritoPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const total = useCartTotal()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Compra
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground">
              Tu carrito
              {itemCount > 0 && (
                <span className="font-sans text-lg text-muted-foreground ml-3">
                  ({itemCount})
                </span>
              )}
            </h1>
          </div>
          <Link
            href="/tienda"
            className="hidden sm:flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Seguir comprando
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            {/* ── Items list ── */}
            <div>
              <ul className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const price =
                      item.variant?.price ?? item.product.price ?? null
                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-5 py-6">
                          {/* Thumbnail */}
                          <Link
                            href={`/producto/${item.product.slug}`}
                            className="shrink-0"
                          >
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted">
                              {item.product.images[0] ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  sizes="112px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="font-serif text-3xl text-muted-foreground/20 italic">
                                    I
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/producto/${item.product.slug}`}>
                              <p className="font-serif text-base sm:text-lg text-foreground hover:underline leading-snug mb-0.5">
                                {item.product.name}
                              </p>
                            </Link>
                            {item.variant && (
                              <p className="font-sans text-sm text-muted-foreground mb-1">
                                {item.variant.name}
                              </p>
                            )}
                            <p className="font-sans text-sm font-medium text-foreground mb-4">
                              {price ? formatPrice(price) : 'Consultar precio'}
                            </p>

                            {/* Qty + remove row */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                                  aria-label="Quitar uno"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-sans text-sm w-6 text-center tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                  aria-label="Agregar uno"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Subtotal + remove */}
                              <div className="flex items-center gap-4">
                                {price && (
                                  <p className="font-sans text-sm font-medium text-foreground hidden sm:block">
                                    {formatPrice(price * item.quantity)}
                                  </p>
                                )}
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Eliminar producto"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>

              {/* Clear cart */}
              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/tienda"
                  className="sm:hidden flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Seguir comprando
                </Link>
                <button
                  onClick={() => {
                    if (confirm('¿Vaciar el carrito?')) clearCart()
                  }}
                  className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground hover:text-red-600 transition-colors ml-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-muted/40 rounded-2xl p-6 border border-border space-y-4">
                <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Resumen
                </p>

                <div className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Productos ({itemCount}{' '}
                      {itemCount === 1 ? 'ítem' : 'ítems'})
                    </span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span>A coordinar</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-sans text-sm font-medium text-foreground">
                    Total
                  </span>
                  <span className="font-serif text-2xl text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    Ir al checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="font-sans text-xs text-muted-foreground text-center">
                  Pago 100% seguro con MercadoPago
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                {[
                  { icon: '🔒', label: 'Pago seguro' },
                  { icon: '📍', label: 'Entregas en Esperanza' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl border border-border bg-card"
                  >
                    <p className="text-lg mb-0.5">{icon}</p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <ShoppingBag className="h-9 w-9 text-muted-foreground/40" />
      </div>
      <div>
        <p className="font-serif text-2xl text-foreground mb-2">
          Tu carrito está vacío
        </p>
        <p className="font-sans text-sm text-muted-foreground max-w-xs">
          Explorá la tienda y encontrá algo que te guste.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/tienda">Ver la tienda</Link>
      </Button>
    </div>
  )
}
