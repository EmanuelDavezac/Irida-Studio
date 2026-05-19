'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, cn } from '@/lib/utils'
import IriEyebrow from '@/components/ui/IriEyebrow'
import { ProductTile, type PlaceholderKind, type Tone } from '@/components/products/placeholders'

const SHIPPING = 1500

type DeliveryMethod = 'envio' | 'retiro'
type StepId = 'entrega' | 'datos' | 'direccion' | 'resumen'

const categoryToKind: Record<string, PlaceholderKind> = {
  agenditas: 'agenda',    stickers: 'stickers',  llaveros: 'keychain',
  fotitos:   'fotitos',   cumpleanos: 'topper',  albumes: 'cuaderno',
  emprendimiento: 'tag',  'a-pintar': 'notebook',
}
const categoryToTone: Record<string, Tone> = {
  agenditas: 'beige', stickers: 'cream', llaveros: 'paper',
  fotitos:   'beige', cumpleanos: 'paper', albumes: 'sage',
}

function getProgressLabels(method: DeliveryMethod | null) {
  return method === 'retiro'
    ? ['Entrega', 'Datos', 'Resumen']
    : ['Entrega', 'Datos', 'Envío', 'Resumen']
}

function getStepIndex(step: StepId, method: DeliveryMethod | null): number {
  if (method === 'retiro') {
    return { entrega: 0, datos: 1, direccion: 1, resumen: 2 }[step] ?? 0
  }
  return { entrega: 0, datos: 1, direccion: 2, resumen: 3 }[step] ?? 0
}

// ── Progress bar ─────────────────────────────────────────
function IriProgress({ step, method }: { step: StepId; method: DeliveryMethod | null }) {
  const labels    = getProgressLabels(method)
  const activeIdx = getStepIndex(step, method)

  return (
    <div className="px-[22px] pt-5 pb-6 bg-ir-cream">
      <div className="flex gap-2 items-center">
        {labels.map((label, i) => {
          const active = i === activeIdx
          const done   = i < activeIdx
          return (
            <div key={label} className="contents">
              <div className="flex items-center gap-2" style={{ opacity: active || done ? 1 : 0.4 }}>
                <span
                  className="grid place-items-center font-serif italic"
                  style={{
                    width: 22, height: 22, borderRadius: 999, fontSize: 9,
                    border: '1px solid var(--ir-ink)',
                    background: done ? 'var(--ir-ink)' : active ? 'var(--ir-gold)' : 'transparent',
                    color: done || active ? 'var(--ir-cream)' : 'var(--ir-ink)',
                    flexShrink: 0,
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className="font-sans uppercase"
                  style={{
                    fontSize: 11, letterSpacing: '0.14em',
                    color: active ? 'var(--ir-ink)' : 'var(--ir-mute)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <span
                  className="flex-1 h-px"
                  style={{ background: i < activeIdx ? 'var(--ir-ink)' : 'var(--ir-line)' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Field / Input helpers ─────────────────────────────────
const inputCls =
  'w-full px-3.5 py-3 text-[14px] font-sans bg-ir-cream border border-ir-line rounded-ir outline-none ' +
  'focus:border-ir-gold focus:bg-white transition-colors ' +
  'placeholder:text-ir-mute/60 disabled:opacity-60 disabled:cursor-not-allowed'

function Field({
  label, htmlFor, note, children,
}: {
  label: string; htmlFor: string; note?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-sans uppercase tracking-[0.12em] text-[10px] text-ir-mute mb-2"
      >
        {label}
        {note && (
          <span className="normal-case tracking-normal text-[9px] ml-1 text-ir-mute/70">{note}</span>
        )}
      </label>
      {children}
    </div>
  )
}

// ── Back link ─────────────────────────────────────────────
function BackBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block mx-auto mt-3.5 bg-transparent border-0 text-[11px] font-sans text-ir-mute tracking-[0.14em] uppercase cursor-pointer"
    >
      {children}
    </button>
  )
}

// ── Primary CTA ───────────────────────────────────────────
function PrimaryBtn({
  onClick, disabled, children,
}: {
  onClick?: () => void; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full h-11 rounded-pill bg-ir-ink text-ir-cream text-[13px] font-sans font-medium tracking-[0.02em] hover:bg-ir-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

// ── Delivery method radio card ────────────────────────────
function DeliveryCard({
  selected, onClick, title, subtitle, price,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
  price: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'grid items-center gap-3 px-4 py-4 rounded-ir-lg border text-left transition-colors w-full',
        selected ? 'border-ir-ink bg-ir-paper' : 'border-ir-line bg-ir-cream hover:border-ir-tan',
      )}
      style={{ gridTemplateColumns: '20px 1fr auto' }}
    >
      <span
        className="grid place-items-center shrink-0"
        style={{
          width: 16, height: 16, borderRadius: 999,
          border: '1.5px solid var(--ir-ink)',
          background: selected ? 'var(--ir-ink)' : 'transparent',
        }}
      >
        {selected && (
          <span className="block rounded-full bg-ir-cream" style={{ width: 6, height: 6 }} />
        )}
      </span>
      <span>
        <span className="block font-serif text-[16px]">{title}</span>
        <span className="text-[11px] text-ir-mute">{subtitle}</span>
      </span>
      <span className="font-serif italic text-ir-gold text-[15px]">{price}</span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────
export default function CheckoutClient() {
  const router      = useRouter()
  const { items }   = useCartStore()

  const [step,           setStep]           = useState<StepId>('entrega')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [customer, setCustomer] = useState({
    email: '', nombre: '', apellido: '',
    telefono: '', dni: '', newsletter: true,
  })
  const [address, setAddress] = useState({
    calle: '', piso: '', cp: '', notas: '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && items.length === 0) router.replace('/tienda')
  }, [mounted, items.length, router])

  const needsShipping = deliveryMethod === 'envio'
  const subtotal      = items.reduce((s, i) => s + (i.variant?.price ?? i.product.price ?? 0) * i.quantity, 0)
  const shipping      = needsShipping ? SHIPPING : 0
  const total         = subtotal + shipping
  const itemCount     = items.reduce((s, i) => s + i.quantity, 0)

  function goNext() {
    setStep(prev => {
      if (prev === 'entrega')  return 'datos'
      if (prev === 'datos')    return needsShipping ? 'direccion' : 'resumen'
      if (prev === 'direccion') return 'resumen'
      return prev
    })
  }

  function goBack() {
    if (step === 'resumen')   { setStep(needsShipping ? 'direccion' : 'datos'); return }
    if (step === 'direccion') { setStep('datos');    return }
    if (step === 'datos')     { setStep('entrega');  return }
    router.back()
  }

  function handleDeliverySelect(method: DeliveryMethod) {
    setDeliveryMethod(method)
    if (method === 'retiro') setAddress({ calle: '', piso: '', cp: '', notas: '' })
  }

  function handleCustomer(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setCustomer(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleAddress(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
  }

  async function handlePay() {
    setLoading(true)
    setError(null)
    try {
      const direccion = needsShipping
        ? `${address.calle}${address.piso ? `, ${address.piso}` : ''}`
        : 'Retiro en local'

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          buyer: {
            nombre:    customer.nombre,
            apellido:  customer.apellido,
            email:     customer.email,
            telefono:  customer.telefono,
            direccion,
            ciudad:    'Esperanza',
            provincia: 'Santa Fe',
            cp:        needsShipping ? address.cp : '3080',
          },
          delivery: {
            method:       deliveryMethod ?? 'retiro',
            shippingCost: shipping,
          },
          subtotal,
          total,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Error al procesar el pago')
      }
      const { init_point } = (await res.json()) as { init_point: string }
      window.location.href = init_point
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  function buildWAUrl() {
    const lines = items.map(i => {
      const price = i.variant?.price ?? i.product.price ?? 0
      return `• ${i.product.name}${i.variant ? ` (${i.variant.name})` : ''} ×${i.quantity} = ${formatPrice(price * i.quantity)}`
    })
    const deliveryLine = needsShipping
      ? `Envío a: ${address.calle}${address.piso ? `, ${address.piso}` : ''}, ${address.cp} Esperanza, SF`
      : 'Entrega: Retiro en local (coordinamos por WA)'

    const msg = [
      'Hola! Quiero hacer un pedido:',
      ...lines,
      `Subtotal: ${formatPrice(subtotal)}`,
      needsShipping ? `Envío: ${formatPrice(SHIPPING)}` : 'Envío: Gratis (retiro en local)',
      `Total: ${formatPrice(total)}`,
      '',
      deliveryLine,
      `Nombre: ${customer.nombre} ${customer.apellido}`,
      `Tel: ${customer.telefono}`,
    ].join('\n')
    return `https://wa.me/5493496567541?text=${encodeURIComponent(msg)}`
  }

  if (!mounted) return null

  const step1Valid = !!(customer.email && customer.nombre && customer.apellido && customer.telefono)
  const step2Valid = !!(address.calle && address.cp)

  return (
    <div className="min-h-screen bg-ir-cream flex flex-col">
      <IriProgress step={step} method={deliveryMethod} />
      <div className="border-b border-ir-line" />

      <div className="flex-1 px-[22px] pb-10">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Step: entrega ── */}
          {step === 'entrega' && (
            <motion.div
              key="entrega"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pt-5 pb-1">
                <h1 className="font-serif font-normal m-0" style={{ fontSize: 30, lineHeight: 1 }}>
                  ¿Cómo lo <em className="italic text-ir-gold">recibís?</em>
                </h1>
                <p className="font-sans text-[12px] text-ir-mute mt-1.5 m-0">
                  Elegí cómo querés recibir tu pedido.
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-5">
                <DeliveryCard
                  selected={deliveryMethod === 'envio'}
                  onClick={() => handleDeliverySelect('envio')}
                  title="Envío a domicilio"
                  subtitle="Esperanza, Santa Fe · 24-48 hs"
                  price={formatPrice(SHIPPING)}
                />
                <DeliveryCard
                  selected={deliveryMethod === 'retiro'}
                  onClick={() => handleDeliverySelect('retiro')}
                  title="Retiro en local"
                  subtitle="Esperanza, Santa Fe · coordinamos por WA"
                  price="Gratis"
                />
              </div>

              <PrimaryBtn onClick={goNext} disabled={!deliveryMethod}>
                Continuar →
              </PrimaryBtn>
              <BackBtn onClick={goBack}>← Volver al carrito</BackBtn>
            </motion.div>
          )}

          {/* ── Step: datos ── */}
          {step === 'datos' && (
            <motion.div
              key="datos"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pt-5 pb-1">
                <h1 className="font-serif font-normal m-0" style={{ fontSize: 30, lineHeight: 1 }}>
                  Tus <em className="italic text-ir-gold">datos.</em>
                </h1>
                <p className="font-sans text-[12px] text-ir-mute mt-1.5 m-0">
                  Solo lo necesario para encontrarte.
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-5">
                <Field label="Email" htmlFor="email">
                  <input
                    id="email" name="email" type="email"
                    value={customer.email} onChange={handleCustomer}
                    placeholder="sofia@correo.com"
                    className={inputCls}
                    autoComplete="email"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre" htmlFor="nombre">
                    <input
                      id="nombre" name="nombre" type="text"
                      value={customer.nombre} onChange={handleCustomer}
                      placeholder="Sofía"
                      className={inputCls}
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field label="Apellido" htmlFor="apellido">
                    <input
                      id="apellido" name="apellido" type="text"
                      value={customer.apellido} onChange={handleCustomer}
                      placeholder="Romero"
                      className={inputCls}
                      autoComplete="family-name"
                    />
                  </Field>
                </div>

                <Field label="Teléfono" htmlFor="telefono">
                  <input
                    id="telefono" name="telefono" type="tel"
                    value={customer.telefono} onChange={handleCustomer}
                    placeholder="+54 11 4821 5500"
                    className={inputCls}
                    autoComplete="tel"
                  />
                </Field>

                <Field label="DNI" htmlFor="dni">
                  <input
                    id="dni" name="dni" type="text"
                    value={customer.dni} onChange={handleCustomer}
                    placeholder="38 219 504"
                    className={inputCls}
                  />
                </Field>

                <label className="flex items-center gap-2.5 text-[12px] font-sans text-ir-ink-soft mt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={customer.newsletter}
                    onChange={handleCustomer}
                    className="w-4 h-4 accent-[#8B6914]"
                  />
                  Quiero recibir novedades de IRIDA por email.
                </label>
              </div>

              <PrimaryBtn onClick={goNext} disabled={!step1Valid}>
                {needsShipping ? 'Continuar al envío →' : 'Revisar pedido →'}
              </PrimaryBtn>
              <BackBtn onClick={goBack}>← Volver</BackBtn>
            </motion.div>
          )}

          {/* ── Step: direccion (solo envio) ── */}
          {step === 'direccion' && (
            <motion.div
              key="direccion"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pt-5 pb-1">
                <h1 className="font-serif font-normal m-0" style={{ fontSize: 30, lineHeight: 1 }}>
                  ¿Dónde lo <em className="italic text-ir-gold">enviamos?</em>
                </h1>
                <p className="font-sans text-[12px] text-ir-mute mt-1.5 m-0">
                  Te avisamos por WhatsApp en cada paso.
                </p>
              </div>

              <div className="mt-6">
                <IriEyebrow className="mb-3">Dirección</IriEyebrow>
                <div className="flex flex-col gap-3">
                  <Field label="Calle y número" htmlFor="calle">
                    <input
                      id="calle" name="calle" type="text"
                      value={address.calle} onChange={handleAddress}
                      placeholder="Lisandro de la Torre 1820"
                      className={inputCls}
                      autoComplete="street-address"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Piso / Depto" htmlFor="piso" note="(opcional)">
                      <input
                        id="piso" name="piso" type="text"
                        value={address.piso} onChange={handleAddress}
                        placeholder="opcional"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Código postal" htmlFor="cp">
                      <input
                        id="cp" name="cp" type="text"
                        value={address.cp} onChange={handleAddress}
                        placeholder="3080"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Ciudad" htmlFor="ciudad">
                    <input
                      id="ciudad" name="ciudad" type="text"
                      defaultValue="Esperanza" disabled
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Provincia" htmlFor="provincia">
                    <input
                      id="provincia" name="provincia" type="text"
                      defaultValue="Santa Fe" disabled
                      className={inputCls}
                    />
                  </Field>

                  <div className="px-3.5 py-2.5 bg-ir-paper rounded-ir font-serif italic text-[11px] text-ir-ink-soft">
                    ✨ Por ahora hacemos envíos solo dentro de Esperanza, Santa Fe.
                  </div>

                  <Field label="Notas para entrega" htmlFor="notas" note="(opcional)">
                    <textarea
                      id="notas" name="notas"
                      value={address.notas}
                      onChange={handleAddress}
                      placeholder="Tocar timbre 3B, gracias!"
                      rows={2}
                      className={cn(inputCls, 'resize-none')}
                    />
                  </Field>
                </div>
              </div>

              <PrimaryBtn onClick={goNext} disabled={!step2Valid}>
                Revisar pedido →
              </PrimaryBtn>
              <BackBtn onClick={goBack}>← Volver</BackBtn>
            </motion.div>
          )}

          {/* ── Step: resumen ── */}
          {step === 'resumen' && (
            <motion.div
              key="resumen"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pt-5 pb-1">
                <h1 className="font-serif font-normal m-0" style={{ fontSize: 30, lineHeight: 1 }}>
                  Revisá tu <em className="italic text-ir-gold">pedido.</em>
                </h1>
                <p className="font-sans text-[12px] text-ir-mute mt-1.5 m-0">
                  Está casi listo para volar.
                </p>
              </div>

              {/* Items */}
              <div className="mt-5">
                <IriEyebrow className="mb-2.5">
                  {itemCount === 1 ? '1 pieza' : `${itemCount} piezas`}
                </IriEyebrow>
                <div className="bg-white border border-ir-line rounded-ir-lg overflow-hidden">
                  {items.map((item, i) => {
                    const price  = item.variant?.price ?? item.product.price ?? 0
                    const kind   = categoryToKind[item.product.category] ?? 'notebook'
                    const tone   = categoryToTone[item.product.category] ?? 'cream'
                    const hasImg = !!item.product.images?.[0]
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 items-center px-3.5 py-3"
                        style={{
                          gridTemplateColumns: '54px 1fr auto',
                          borderTop: i === 0 ? 'none' : '1px solid var(--ir-line)',
                        }}
                      >
                        <div className="overflow-hidden rounded-sm" style={{ height: 64 }}>
                          {hasImg ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="54px"
                              />
                            </div>
                          ) : (
                            <ProductTile kind={kind} tone={tone} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif text-[14px] leading-snug">{item.product.name}</div>
                          <div className="font-sans text-[11px] text-ir-mute">
                            {item.variant ? `${item.variant.name} · ` : ''}×{item.quantity}
                          </div>
                        </div>
                        <span className="font-serif italic text-ir-gold text-[14px] shrink-0">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Address + method cards */}
              <div className={cn('gap-2.5 mt-4', needsShipping ? 'grid grid-cols-2' : 'flex')}>
                {needsShipping && (
                  <div className="p-3.5 border border-ir-line rounded-ir-lg">
                    <IriEyebrow className="mb-1.5">Envío a</IriEyebrow>
                    <div className="font-serif text-[13px] leading-snug">
                      {address.calle}{address.piso ? `, ${address.piso}` : ''}<br />
                      {address.cp} · Esperanza, Santa Fe
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('direccion')}
                      className="block bg-transparent border-0 p-0 mt-1.5 font-sans text-[10px] text-ir-gold tracking-[0.14em] uppercase cursor-pointer"
                    >
                      cambiar
                    </button>
                  </div>
                )}
                <div className="p-3.5 border border-ir-line rounded-ir-lg flex-1">
                  <IriEyebrow className="mb-1.5">Método</IriEyebrow>
                  <div className="font-serif text-[13px] leading-snug">
                    {needsShipping ? (
                      <>Envío local<br /><span className="italic text-ir-mute">24-48 hs</span></>
                    ) : (
                      <>Retiro en local<br /><span className="italic text-ir-mute">coordinamos por WA</span></>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('entrega')}
                    className="block bg-transparent border-0 p-0 mt-1.5 font-sans text-[10px] text-ir-gold tracking-[0.14em] uppercase cursor-pointer"
                  >
                    cambiar
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-5 py-4 border-t border-b border-ir-line">
                <div className="flex justify-between py-0.5 text-[13px] font-sans text-ir-mute">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-[13px] font-sans text-ir-mute">
                  <span>Envío</span>
                  <span>{needsShipping ? formatPrice(SHIPPING) : 'Gratis'}</span>
                </div>
                <div className="flex items-baseline justify-between mt-2.5">
                  <span className="font-serif italic text-[18px]">Total</span>
                  <span className="font-serif italic text-ir-gold text-[28px]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 px-4 py-3 rounded-ir bg-red-50 border border-red-200 text-red-700 font-sans text-[13px]">
                  {error}
                </div>
              )}

              {/* MercadoPago CTA */}
              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="mt-5 w-full flex items-center justify-center gap-3 px-6 rounded-xl transition-all disabled:opacity-60 hover:brightness-95"
                style={{ height: 64, background: '#00AEEF' }}
              >
                {loading ? (
                  <span className="mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-sans text-[15px] font-semibold text-white tracking-[0.01em]">
                      Pagar con
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-mp.png"
                      alt="Mercado Pago"
                      style={{ height: 36, width: 'auto' }}
                    />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2.5 my-3.5">
                <span className="flex-1 h-px bg-ir-line" />
                <span className="font-serif italic text-[13px] text-ir-mute">o</span>
                <span className="flex-1 h-px bg-ir-line" />
              </div>

              {/* WhatsApp CTA */}
              <a
                href={buildWAUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 rounded-pill text-white text-[14px] font-sans font-semibold tracking-[0.02em] bg-wa"
                style={{ height: 52 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff">
                  <path d="M 8 0 a 8 8 0 0 0-6.93 12 L 0 16 l 4.16-1.05 A 8 8 0 1 0 8 0 Z m 4.53 11.34 c-0.19 0.53-1.1 1.02-1.55 1.07-0.46 0.07-1.05 0.1-1.69-0.1-0.39-0.13-0.89-0.29-1.53-0.57-2.7-1.16-4.46-3.88-4.59-4.06-0.13-0.18-1.1-1.46-1.1-2.78 0-1.32 0.69-1.97 0.94-2.24 0.25-0.27 0.55-0.34 0.73-0.34 0.18 0 0.37 0 0.53 0.01 0.17 0.01 0.4-0.06 0.62 0.47 0.23 0.55 0.78 1.87 0.85 2.01 0.07 0.13 0.11 0.29 0.02 0.47-0.09 0.18-0.13 0.29-0.27 0.45-0.13 0.16-0.28 0.36-0.4 0.48-0.13 0.13-0.27 0.27-0.12 0.54 0.16 0.27 0.7 1.16 1.51 1.88 1.04 0.93 1.92 1.21 2.18 1.35 0.27 0.13 0.43 0.11 0.59-0.07 0.16-0.18 0.68-0.79 0.86-1.06 0.18-0.27 0.36-0.23 0.61-0.13 0.25 0.09 1.57 0.74 1.83 0.87 0.27 0.13 0.45 0.2 0.51 0.31 0.07 0.11 0.07 0.66-0.12 1.19 z"/>
                </svg>
                Enviar pedido por WhatsApp
              </a>
              <p className="text-center mt-2.5 font-serif italic text-[11px] text-ir-mute m-0">
                Coordinamos pago y {needsShipping ? 'envío' : 'retiro'} directo por chat
              </p>

              <p className="text-center mt-3.5 font-sans text-[10px] text-ir-mute tracking-[0.12em] uppercase m-0">
                Pago protegido · Tus datos no se comparten
              </p>

              <BackBtn onClick={goBack}>← Volver</BackBtn>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
