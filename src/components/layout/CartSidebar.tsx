'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()
  const total = useCartTotal()

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={closeCart}
            aria-hidden
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-serif text-xl">
                Carrito
                {items.length > 0 && (
                  <span className="font-sans text-sm text-muted-foreground ml-2">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  <div>
                    <p className="font-serif text-lg text-foreground mb-1">
                      Tu carrito está vacío
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">
                      Explorá la tienda y encontrá algo especial.
                    </p>
                  </div>
                  <Button variant="outline" onClick={closeCart} asChild>
                    <Link href="/tienda">Ver productos</Link>
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {items.map((item) => {
                    const price = item.variant?.price ?? item.product.price ?? 0
                    return (
                      <li key={item.id} className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-serif text-2xl text-muted-foreground/20 italic">
                                I
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm leading-snug text-foreground mb-0.5 truncate">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="font-sans text-sm font-medium text-foreground mb-3">
                            {formatPrice(price)}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Quitar uno"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-sans text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Agregar uno"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-serif text-lg font-medium">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  onClick={closeCart}
                >
                  <Link href="/checkout">
                    Ir al checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
