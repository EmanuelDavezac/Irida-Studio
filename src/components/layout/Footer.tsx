import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl italic mb-3">Irida</p>
            <p className="text-background/50 font-sans text-sm leading-relaxed max-w-xs">
              Diseño que se siente tuyo. Papelería y productos de diseño hechos
              con amor desde Esperanza, Santa Fe.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-background/40 mb-4">
              Navegá
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/tienda', label: 'Tienda' },
                { href: '/contacto', label: 'Contacto' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-sans text-sm text-background/70 hover:text-background transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-background/40 mb-4">
              Contacto
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5493496567541"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-sm text-background/70 hover:text-background transition-colors"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>+54 3496 567541</span>
              </a>
              <a
                href="https://instagram.com/irida_studio1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-sm text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                <span>@irida_studio1</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-background/30">
            © {currentYear} Irida Studio. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-background/30">
            Hecho con amor · Esperanza, Santa Fe
          </p>
        </div>
      </div>
    </footer>
  )
}
