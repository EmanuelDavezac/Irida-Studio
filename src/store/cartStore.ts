'use client'

import { create } from 'zustand'
import type { CartItem, Product, Variant } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, variant?: Variant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

function buildItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : productId
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, variant, quantity = 1) => {
    const id = buildItemId(product.id, variant?.id)
    const existing = get().items.find((item) => item.id === id)
    if (existing) {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      }))
    } else {
      set((state) => ({
        items: [...state.items, { id, product, variant, quantity }],
      }))
    }
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }))
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))

export function useCartTotal() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.product.price ?? 0
      return sum + price * item.quantity
    }, 0)
  )
}

export function useCartItemCount() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
}
