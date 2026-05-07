import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">
          404
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
          Página no encontrada
        </h1>
        <p className="font-sans text-muted-foreground mb-10 max-w-sm mx-auto">
          Lo que buscás no existe o fue removido. Explorá la tienda para
          encontrar algo que te guste.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
