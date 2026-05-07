'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, ShoppingBag, AlertCircle, MapPin } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/store/cartStore'
import { formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface BuyerForm {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
}

const emptyForm: BuyerForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items } = useCartStore()
  const total = useCartTotal()
  const [form, setForm] = useState<BuyerForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace('/tienda')
    }
  }, [mounted, items.length, router])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const hasNullPrice = items.some(
    (item) => (item.variant?.price ?? item.product.price) === null
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (hasNullPrice) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, buyer: form }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Error al procesar el pago')
      }

      const { init_point } = await res.json()
      window.location.href = init_point
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-12">
          <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
            Compra
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* ── Form column ── */}
            <div className="space-y-10">
              {/* Personal data */}
              <fieldset>
                <legend className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-6">
                  Datos personales
                </legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nombre" htmlFor="nombre">
                    <Input
                      id="nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="María"
                      required
                    />
                  </Field>
                  <Field label="Apellido" htmlFor="apellido">
                    <Input
                      id="apellido"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="González"
                      required
                    />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="maria@email.com"
                      required
                    />
                  </Field>
                  <Field label="Teléfono" htmlFor="telefono">
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+54 3496 123456"
                      required
                    />
                  </Field>
                </div>
              </fieldset>

              {/* Delivery address */}
              <fieldset>
                <legend className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-6">
                  Dirección de entrega
                </legend>
                <div className="space-y-4">
                  {/* Zone notice */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary border border-border">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-muted-foreground">
                      Solo realizamos entregas en{' '}
                      <span className="font-medium text-foreground">
                        Esperanza, Santa Fe
                      </span>
                      . Para otros destinos consultá por WhatsApp.
                    </p>
                  </div>

                  <Field label="Calle y número" htmlFor="direccion">
                    <Input
                      id="direccion"
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      placeholder="San Martín 450, Depto 2"
                      required
                    />
                  </Field>
                </div>
              </fieldset>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="font-sans text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* ── Order summary column ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-muted/40 rounded-2xl p-6 border border-border">
                <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-6">
                  Tu pedido
                </p>

                {/* Items */}
                <ul className="space-y-4 mb-6">
                  {items.map((item) => {
                    const price =
                      item.variant?.price ?? item.product.price ?? null
                    return (
                      <li key={item.id} className="flex gap-3 items-start">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-background shrink-0">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm text-foreground leading-tight truncate">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="font-sans text-xs text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="font-sans text-xs text-muted-foreground">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="font-sans text-sm font-medium text-foreground shrink-0">
                          {price ? formatPrice(price * item.quantity) : '—'}
                        </p>
                      </li>
                    )
                  })}
                </ul>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-muted-foreground">
                      Total
                    </span>
                    <span className="font-serif text-xl text-foreground">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {hasNullPrice ? (
                  <div className="text-center space-y-3">
                    <p className="font-sans text-sm text-muted-foreground">
                      Uno o más productos requieren consulta de precio.
                    </p>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <a
                        href="https://wa.me/5493496567541?text=Hola! Quiero hacer un pedido"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Consultar por WhatsApp
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Pagar con MercadoPago'
                    )}
                  </Button>
                )}

                <p className="font-sans text-xs text-muted-foreground text-center mt-4">
                  Serás redirigido a MercadoPago para completar el pago de
                  forma segura.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass =
  'w-full border border-border rounded-xl px-4 py-3 font-sans text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'

function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block font-sans text-xs font-medium text-foreground mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
