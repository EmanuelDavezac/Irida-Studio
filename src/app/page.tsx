import type { Metadata } from 'next'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'
import IriEyebrow from '@/components/ui/IriEyebrow'
import HomeFeaturedCard from '@/components/home/HomeFeaturedCard'
import {
  OpenNotebook,
  Agenda,
  Stickers,
  Topper,
  Tag,
  type PlaceholderKind,
  type Tone,
} from '@/components/products/placeholders'

export const metadata: Metadata = {
  title: 'Irida Studio — Papelería y diseño',
}

/* ── Static fallback when DB has no products ── */
const PLACEHOLDER_PRODUCTS = [
  { id: '1', slug: 'agenda-2026-crema',    name: 'Agenda 2026 · Crema',   price: 18900, category: 'agenditas',   featured: true, shortDescription: '', description: '', images: [], inStock: true, variants: [] },
  { id: '2', slug: 'cuaderno-espiral-a5',  name: 'Cuaderno espiral A5',   price:  9800, category: 'albumes',     featured: true, shortDescription: '', description: '', images: [], inStock: true, variants: [] },
  { id: '3', slug: 'pack-stickers-hello',  name: 'Pack stickers · Hello', price:  3200, category: 'stickers',   featured: true, shortDescription: '', description: '', images: [], inStock: true, variants: [] },
  { id: '4', slug: 'llavero-personalizado',name: 'Llavero personalizado', price:  4500, category: 'llaveros',   featured: true, shortDescription: '', description: '', images: [], inStock: true, variants: [] },
]

const CATEGORIES: { label: string; slug: string; kind: PlaceholderKind; tone: Tone }[] = [
  { label: 'Agendas',  slug: 'agenditas', kind: 'agenda',   tone: 'beige' },
  { label: 'Stickers', slug: 'stickers',  kind: 'stickers', tone: 'cream' },
  { label: 'Toppers',  slug: 'cumpleanos',kind: 'topper',   tone: 'paper' },
  { label: 'Tags',     slug: 'emprendimiento', kind: 'tag', tone: 'sage'  },
]

/* Map product category → placeholder illustration */
const kindMap: Record<string, PlaceholderKind> = {
  agenditas:      'agenda',
  stickers:       'stickers',
  llaveros:       'keychain',
  fotitos:        'fotitos',
  cumpleanos:     'topper',
  albumes:        'cuaderno',
  emprendimiento: 'tag',
  'a-pintar':     'notebook',
}
const toneMap: Record<string, Tone> = {
  agenditas: 'beige',
  stickers:  'cream',
  llaveros:  'paper',
  fotitos:   'beige',
  cumpleanos:'paper',
  albumes:   'sage',
}

export default async function HomePage() {
  let featured = await getFeaturedProducts().catch(() => [])
  const usingPlaceholders = featured.length === 0
  if (usingPlaceholders) {
    featured = PLACEHOLDER_PRODUCTS as typeof featured
  }
  const displayProducts = featured.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative h-[540px] -mt-14">
        {/* Background illustration */}
        <div className="absolute inset-0">
          <OpenNotebook tone="cream" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(26,22,18,0.55) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between px-[22px] pt-[70px] pb-7">
          {/* New tag */}
          <div>
            <span className="inline-block px-[10px] py-1 bg-ir-cream/92 text-ir-ink text-[9px] tracking-[0.22em] uppercase font-sans">
              Nuevo · 04 / 26
            </span>
          </div>

          {/* Headline + copy */}
          <div className="text-ir-cream">
            <h1
              className="font-serif font-normal m-0"
              style={{ fontSize: 64, lineHeight: 0.9, color: '#FBF7F0' }}
            >
              Diseño<br />
              <em style={{ fontStyle: 'italic', color: '#FBF7F0', opacity: 0.85 }}>que</em><br />
              <em style={{ fontStyle: 'italic', color: '#B8924C' }}>inspira.</em>
            </h1>
            <div className="flex justify-between items-end mt-6">
              <p className="m-0 text-[12px] font-sans opacity-85 max-w-[200px] leading-[1.4]">
                Papelería pensada en cada doblez. Pequeños lotes, papel marfil, dorado mate.
              </p>
              <Link href="/tienda" aria-label="Explorar tienda">
                <span className="font-serif italic text-[24px]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIFIESTO ──────────────────────────────────── */}
      <section className="px-7 py-12 text-center bg-ir-cream">
        <IriEyebrow>Manifiesto</IriEyebrow>
        <p
          className="font-serif italic font-normal text-ir-ink mt-3.5"
          style={{ fontSize: 22, lineHeight: 1.35 }}
        >
          Hacemos pocas piezas, despacio.<br />
          Cada una pensada para acompañarte<br />
          una temporada entera.
        </p>
      </section>

      {/* ── DESTACADOS ──────────────────────────────────── */}
      <section className="bg-ir-paper px-5 pt-6 pb-9">
        <div className="flex items-baseline justify-between mb-[18px]">
          <h2 className="font-serif m-0" style={{ fontSize: 26 }}>
            Destacados<span className="text-ir-gold">.</span>
          </h2>
          <Link
            href="/tienda"
            className="text-[11px] tracking-[0.16em] uppercase text-ir-mute font-sans hover:text-ir-ink transition-colors"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Product 1 — large, spans 2 cols */}
          {displayProducts[0] && (
            <div className="col-span-2">
              <HomeFeaturedCard
                product={displayProducts[0]}
                large
                placeholderKind={kindMap[displayProducts[0].category] ?? 'agenda'}
                placeholderTone={toneMap[displayProducts[0].category] ?? 'beige'}
                isPlaceholder={usingPlaceholders}
              />
            </div>
          )}

          {/* Products 2 & 3 — 1 col each */}
          {displayProducts[1] && (
            <HomeFeaturedCard
              product={displayProducts[1]}
              placeholderKind={kindMap[displayProducts[1].category] ?? 'cuaderno'}
              placeholderTone={toneMap[displayProducts[1].category] ?? 'sage'}
              isPlaceholder={usingPlaceholders}
            />
          )}
          {displayProducts[2] && (
            <HomeFeaturedCard
              product={displayProducts[2]}
              placeholderKind={kindMap[displayProducts[2].category] ?? 'stickers'}
              placeholderTone={toneMap[displayProducts[2].category] ?? 'cream'}
              isPlaceholder={usingPlaceholders}
            />
          )}

          {/* Product 4 — wide, spans 2 cols */}
          {displayProducts[3] && (
            <div className="col-span-2">
              <HomeFeaturedCard
                product={displayProducts[3]}
                wide
                placeholderKind={kindMap[displayProducts[3].category] ?? 'keychain'}
                placeholderTone={toneMap[displayProducts[3].category] ?? 'paper'}
                isPlaceholder={usingPlaceholders}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORÍAS 2×2 ──────────────────────────────── */}
      <section className="px-[22px] pt-10 pb-12 bg-ir-cream">
        <IriEyebrow>Categorías</IriEyebrow>
        <h2
          className="font-serif font-normal m-0 mt-2.5 mb-[22px]"
          style={{ fontSize: 28, lineHeight: 1 }}
        >
          Para cada<br />
          <em className="text-ir-gold">pequeño ritual.</em>
        </h2>

        <div className="grid grid-cols-2 gap-3.5">
          {CATEGORIES.map((cat) => {
            const Illustration = ((): React.ReactNode => {
              switch (cat.kind) {
                case 'agenda':   return <Agenda    tone={cat.tone} />
                case 'stickers': return <Stickers  tone={cat.tone} />
                case 'topper':   return <Topper    tone={cat.tone} />
                case 'tag':      return <Tag       tone={cat.tone} />
                default:         return <Agenda    tone={cat.tone} />
              }
            })()

            return (
              <Link
                key={cat.label}
                href={`/tienda?categoria=${cat.slug}`}
                className="relative overflow-hidden block"
                style={{ aspectRatio: '1 / 1.15' }}
              >
                {Illustration}
                <div className="absolute left-3 bottom-3 bg-ir-cream/94 px-2.5 py-1.5">
                  <span className="font-serif italic text-[15px]">{cat.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── BANNER COLECCIÓN MARFIL ──────────────────────── */}
      <section className="mx-5 mb-9 relative overflow-hidden bg-ir-ink text-ir-cream">
        <div className="relative z-10 px-[22px] pt-9 pb-10">
          <IriEyebrow color="#B8924C">Edición limitada</IriEyebrow>
          <h2
            className="font-serif m-0 mt-3 mb-3.5 text-ir-cream"
            style={{ fontSize: 34, lineHeight: 1 }}
          >
            Colección<br />
            <span className="italic text-ir-gold-light">Marfil</span>
          </h2>
          <p className="font-sans text-[13px] text-ir-cream/75 m-0 mb-[22px] max-w-[220px] leading-[1.45]">
            14 piezas en papel marfil con detalles en dorado mate. Hechas a mano en pequeños lotes.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center px-5 py-3.5 rounded-pill bg-ir-gold text-ir-cream text-[13px] font-medium tracking-[0.02em] hover:bg-ir-gold-light transition-colors"
          >
            Explorar colección →
          </Link>
        </div>
        {/* Decorative floating agenda */}
        <div className="absolute right-[-50px] bottom-[-30px] w-[200px] h-[200px] opacity-30 pointer-events-none">
          <Agenda tone="ink" />
        </div>
      </section>

    </div>
  )
}
