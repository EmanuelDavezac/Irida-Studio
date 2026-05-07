import type { Metadata } from 'next'
import { Instagram, MessageCircle, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contactá a Irida Studio por WhatsApp o Instagram. Atención personalizada para tu pedido.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl">
          <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
            Hablemos
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
            Contacto
          </h1>
          <p className="font-sans text-muted-foreground leading-relaxed mb-16 text-lg">
            Tenés dudas sobre un producto, querés hacer un pedido personalizado
            o necesitás ayuda con tu compra. Escribinos — respondemos rápido.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5493496567541?text=Hola! Me contacto desde la tienda de Irida Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 p-8 rounded-2xl border border-border hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-card"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-serif text-xl text-foreground mb-1">
                  WhatsApp
                </p>
                <p className="font-sans text-muted-foreground text-sm mb-3">
                  +54 3496 567541
                </p>
                <p className="font-sans text-sm text-muted-foreground/70">
                  La forma más rápida de contactarnos. Respondemos a la brevedad.
                </p>
              </div>
              <span className="font-sans text-sm text-foreground group-hover:underline mt-auto">
                Abrir WhatsApp →
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/irida_studio1"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 p-8 rounded-2xl border border-border hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-card"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-serif text-xl text-foreground mb-1">
                  Instagram
                </p>
                <p className="font-sans text-muted-foreground text-sm mb-3">
                  @irida_studio1
                </p>
                <p className="font-sans text-sm text-muted-foreground/70">
                  Seguinos para ver novedades, lanzamientos y el detrás de escena.
                </p>
              </div>
              <span className="font-sans text-sm text-foreground group-hover:underline mt-auto">
                Ir al perfil →
              </span>
            </a>
          </div>

          {/* Extra info */}
          <div className="mt-12 pt-12 border-t border-border grid sm:grid-cols-2 gap-8">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-medium text-foreground mb-1">
                  Horario de atención
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  Lunes a viernes, 9 a 18 hs
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-medium text-foreground mb-1">
                  Ubicación
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  Esperanza, Santa Fe
                  <br />
                  Entregas solo en Esperanza
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
