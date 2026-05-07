import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/products/ProductCard'
import { getFeaturedProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Irida Studio — Papelería y diseño',
}

const categories = [
  { slug: 'stickers', label: 'Stickers', emoji: '✨', bg: 'bg-rose-50' },
  { slug: 'agenditas', label: 'Agenditas', emoji: '📓', bg: 'bg-emerald-50' },
  { slug: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂', bg: 'bg-purple-50' },
  { slug: 'fotitos', label: 'Fotitos', emoji: '📸', bg: 'bg-amber-50' },
  { slug: 'llaveros', label: 'Llaveros', emoji: '🔑', bg: 'bg-sky-50' },
  { slug: 'emprendimiento', label: 'Emprendimiento', emoji: '🏷️', bg: 'bg-orange-50' },
  { slug: 'albumes', label: 'Álbumes', emoji: '📚', bg: 'bg-pink-50' },
  { slug: 'a-pintar', label: '¡A pintar!', emoji: '🎨', bg: 'bg-yellow-50' },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* Hero */}
      <section className="min-h-[88vh] flex items-center bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-8">
              Irida Studio
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground mb-6">
              Diseño que
              <br />
              <em>se siente</em>
              <br />
              tuyo.
            </h1>
            <p className="font-sans text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">
              Stickers, agendas, álbumes y más — hechos con amor y atención al
              detalle.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/tienda">
                  Ver tienda <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contacto">Escribinos</Link>
              </Button>
            </div>
          </div>

          {/* Decorative */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-secondary/60" />
              <div className="absolute inset-12 rounded-full bg-secondary/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-9xl text-primary/20 italic select-none">
                  I
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
                Selección
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
                Lo más querido
              </h2>
            </div>
            <Link
              href="/tienda"
              className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Categorías
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
              Explorá la tienda
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tienda?categoria=${cat.slug}`}
                className={`group ${cat.bg} rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 aspect-square`}
              >
                <span className="text-3xl sm:text-4xl">{cat.emoji}</span>
                <span className="font-sans text-xs sm:text-sm font-medium text-foreground text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-7 w-7 mx-auto mb-8 text-primary/60" />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight">
            Cada detalle,
            <br />
            pensado para vos.
          </h2>
          <p className="font-sans text-background/50 mb-10 max-w-sm mx-auto leading-relaxed">
            Encontrá el regalo perfecto o ese capricho que te merecés.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-background/40 text-background hover:bg-background hover:text-foreground"
          >
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
