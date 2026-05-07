'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, UserCircle, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore, useCartItemCount } from '@/store/cartStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: session, status } = useSession()
  const openCart = useCartStore((s) => s.openCart)
  const itemCount = useCartItemCount()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-2xl italic text-foreground hover:text-foreground/80 transition-colors"
            >
              Irida
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Auth button — desktop */}
              {status !== 'loading' && (
                <div className="hidden md:flex items-center">
                  {session ? (
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Salir
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    >
                      <UserCircle className="h-4 w-4" />
                      Iniciar sesión
                    </Link>
                  )}
                </div>
              )}

              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Abrir carrito"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Abrir menú"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-0 right-0 z-20 bg-background border-b border-border shadow-lg md:hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-base text-foreground py-1"
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-border pt-4">
                {session ? (
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                    className="flex items-center gap-2 font-sans text-base text-muted-foreground py-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 font-sans text-base text-foreground py-1"
                    >
                      <UserCircle className="h-4 w-4" />
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/registro"
                      onClick={() => setMobileOpen(false)}
                      className="font-sans text-base text-muted-foreground py-1 pl-6"
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
