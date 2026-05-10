'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useCartItemCount } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import IriLogo from '@/components/ui/IriLogo'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const openCart = useCartStore((s) => s.openCart)
  const itemCount = useCartItemCount()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 h-14 flex items-center justify-between px-5 transition-all duration-300',
          scrolled
            ? 'bg-ir-cream/92 backdrop-blur-[8px] backdrop-saturate-150 border-b border-ir-line/50'
            : 'bg-transparent'
        )}
      >
        {/* Hamburger — left */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          className="w-9 h-9 flex items-center justify-center shrink-0"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.4">
            <line x1="0" y1="2" x2="20" y2="2" />
            <line x1="0" y1="7" x2="14" y2="7" />
            <line x1="0" y1="12" x2="20" y2="12" />
          </svg>
        </button>

        {/* Logo — center (absolute so it stays visually centered) */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Irida Studio">
          <IriLogo size={24} />
        </Link>

        {/* Cart — right */}
        <button
          onClick={openCart}
          aria-label="Abrir carrito"
          className="w-9 h-9 flex items-center justify-center relative shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M 3 5 L 6 5 L 7.5 14 L 17 14 L 18.5 7 L 6.5 7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          {mounted && itemCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-ir-gold text-ir-cream text-[9px] font-sans font-semibold grid place-items-center leading-none">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-ir-ink/40 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-[80%] max-w-xs bg-ir-cream z-50 flex flex-col p-8 gap-6"
            >
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="self-end mb-4 text-ir-mute"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <line x1="2" y1="2" x2="14" y2="14" /><line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </button>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-xl text-ir-ink hover:text-ir-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-auto border-t border-ir-line pt-6">
                <IriLogo size={22} color="#6B6157" />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
