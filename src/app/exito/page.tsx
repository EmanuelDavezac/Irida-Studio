import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartClearer from './CartClearer'

export const metadata: Metadata = {
  title: 'Pago exitoso',
  robots: { index: false },
}

interface Props {
  searchParams: Promise<{
    payment_id?: string
    status?: string
    merchant_order_id?: string
  }>
}

export default async function ExitoPage({ searchParams }: Props) {
  const { payment_id, merchant_order_id } = await searchParams
  const clean = (v?: string) => (v && v !== 'null' ? v : undefined)
  const orderRef = clean(merchant_order_id) ?? clean(payment_id) ?? null

  return (
    <>
      {/* Clear cart on client side once payment succeeds */}
      <CartClearer />

      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center px-4 max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
            Pago aprobado
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
            ¡Gracias por tu compra!
          </h1>
          <p className="font-sans text-muted-foreground leading-relaxed mb-3">
            Recibimos tu pedido. En breve te escribimos por WhatsApp o email
            para coordinar el envío.
          </p>

          {orderRef && (
            <p className="font-sans text-xs text-muted-foreground mb-10">
              N.º de orden:{' '}
              <span className="font-medium text-foreground">{orderRef}</span>
            </p>
          )}

          {!orderRef && <div className="mb-10" />}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/tienda">Seguir comprando</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://wa.me/5493496567541?text=Hola! Acabo de hacer una compra en Irida Studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribirnos por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
