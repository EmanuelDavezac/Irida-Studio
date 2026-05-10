import Link from 'next/link'
import IriLogo from '@/components/ui/IriLogo'

interface FooterProps {
  minimal?: boolean
}

export default function Footer({ minimal = false }: FooterProps) {
  return (
    <footer
      className={minimal ? 'py-6 px-5' : 'bg-ir-ink text-ir-cream pt-10 pb-7 px-5'}
    >
      {!minimal && (
        <div className="flex flex-col gap-4 mb-7">
          <IriLogo size={28} color="#FBF7F0" />
          <p className="font-serif italic text-[18px] leading-snug text-ir-cream/90 max-w-[240px]">
            Diseño que inspira, hecho para guardar.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className={`text-[9px] tracking-[0.2em] uppercase mb-2.5 ${minimal ? 'text-ir-mute' : 'text-ir-cream/60'}`}>
            Tienda
          </p>
          <ul className="flex flex-col gap-2 text-[13px]">
            {[
              { href: '/tienda', label: 'Catálogo' },
              { href: '/tienda', label: 'Novedades' },
              { href: '/contacto', label: 'Personalizados' },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={minimal ? 'text-ir-ink hover:text-ir-gold transition-colors' : 'text-ir-cream/70 hover:text-ir-cream transition-colors'}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={`text-[9px] tracking-[0.2em] uppercase mb-2.5 ${minimal ? 'text-ir-mute' : 'text-ir-cream/60'}`}>
            Contacto
          </p>
          <ul className="flex flex-col gap-2 text-[13px]">
            <li>
              <a
                href="https://wa.me/5493496567541"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 ${minimal ? 'text-ir-ink' : 'text-ir-cream/70 hover:text-ir-cream transition-colors'}`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0a6 6 0 0 0-5.2 9L0 12l3.1-.8A6 6 0 1 0 6 0Zm3.4 8.5c-.2.4-1 .8-1.3.8-.4 0-.8.2-2.5-.6S2.7 6 2.5 5.7s-.4-1.1-.4-1.5c0-.4.2-.6.4-.8.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3l.5 1.2c0 .1.1.3 0 .4l-.2.3-.2.2c-.1.1 0 .3 0 .4 0 .1.4.7.9 1.2.6.4 1.1.6 1.3.6.1 0 .2 0 .3-.1l.4-.4c.1-.1.2-.1.4-.1.1 0 1 .5 1.1.6.2 0 .3.1.3.2.1.1.1.5 0 .8Z"/>
                </svg>
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/irida_studio1"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 ${minimal ? 'text-ir-ink' : 'text-ir-cream/70 hover:text-ir-cream transition-colors'}`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="0.5" y="0.5" width="11" height="11" rx="2.5"/>
                  <circle cx="6" cy="6" r="2.4"/>
                  <circle cx="9.2" cy="2.8" r="0.5" fill="currentColor"/>
                </svg>
                Instagram
              </a>
            </li>
            <li className={minimal ? 'text-ir-mute' : 'text-ir-cream/70'}>
              hola@irida.com
            </li>
          </ul>
        </div>
      </div>

      {!minimal && (
        <div className="mt-7 pt-5 border-t border-ir-cream/[0.12] text-[10px] text-ir-cream/40 tracking-[0.1em]">
          © 2026 IRIDA · Diseñado en Buenos Aires
        </div>
      )}
    </footer>
  )
}
