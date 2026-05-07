'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/types'

function cartKey(email: string | null) {
  return email ? `irida-cart-${email}` : 'irida-cart-guest'
}

function saveCart(email: string | null, items: CartItem[]) {
  localStorage.setItem(cartKey(email), JSON.stringify(items))
}

function loadCart(email: string | null): CartItem[] {
  try {
    const raw = localStorage.getItem(cartKey(email))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function CartSessionSync() {
  const { data: session, status } = useSession()
  const items = useCartStore((s) => s.items)
  // undefined = not yet initialized, null = guest, string = email
  const prevEmailRef = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (status === 'loading') return

    const email = session?.user?.email ?? null
    const prevEmail = prevEmailRef.current

    if (prevEmail === undefined) {
      // First load — restore this user's saved cart
      const saved = loadCart(email)
      if (saved.length > 0) useCartStore.setState({ items: saved })
    } else if (prevEmail !== email) {
      // User changed — save previous cart, load new user's cart
      saveCart(prevEmail, useCartStore.getState().items)
      const saved = loadCart(email)
      useCartStore.setState({ items: saved })
    }

    prevEmailRef.current = email
  }, [status, session])

  // Persist on every cart change
  useEffect(() => {
    if (prevEmailRef.current === undefined) return
    saveCart(session?.user?.email ?? null, items)
  }, [items, session])

  return null
}
