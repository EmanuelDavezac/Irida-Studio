'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogIn, UserPlus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('welcome-seen')) {
      setOpen(true)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem('welcome-seen', '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-background rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-200">
        <div>
          <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
            Irida Studio
          </p>
          <h2 className="font-serif text-3xl text-foreground leading-tight">
            Bienvenida
          </h2>
          <p className="font-sans text-muted-foreground text-sm mt-3 leading-relaxed">
            Iniciá sesión para guardar favoritos, hacer pedidos y más.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button asChild size="lg" className="w-full" onClick={dismiss}>
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar sesión
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full" onClick={dismiss}>
            <Link href="/registro">
              <UserPlus className="h-4 w-4 mr-2" />
              Crear cuenta
            </Link>
          </Button>
        </div>

        <button
          onClick={dismiss}
          className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 underline-offset-4 hover:underline"
        >
          Ver tienda de todos modos <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
