import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pago no completado',
  robots: { index: false },
}

interface Props {
  searchParams: Promise<{
    payment_id?: string
    status?: string
    status_detail?: string
  }>
}

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  rejected: {
    title: 'El pago fue rechazado',
    body: 'El medio de pago no fue aprobado. Podés intentar con otra tarjeta o método.',
  },
  pending: {
    title: 'Pago pendiente',
    body: 'Tu pago está siendo procesado. Te avisaremos cuando se confirme.',
  },
}

export default async function FalloPage({ searchParams }: Props) {
  const { status, payment_id } = await searchParams
  const msg =
    STATUS_MESSAGES[status ?? ''] ?? {
      title: 'No pudimos procesar tu pago',
      body: 'Algo salió mal. Podés intentarlo de nuevo o consultarnos por WhatsApp.',
    }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-4 max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
          {status === 'pending' ? 'Pendiente' : 'Error'}
        </p>
        <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
          {msg.title}
        </h1>
        <p className="font-sans text-muted-foreground leading-relaxed mb-10">
          {msg.body}
          {payment_id && (
            <>
              {' '}
              <span className="text-xs block mt-2">
                Referencia: {payment_id}
              </span>
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/checkout">
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://wa.me/5493496567541?text=Hola! Tuve un problema para pagar en Irida Studio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Escribirnos
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
