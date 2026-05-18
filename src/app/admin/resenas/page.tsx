'use client'

import { useEffect, useState } from 'react'

type Review = {
  id: string
  productSlug: string
  name: string
  rating: number
  comment: string
  approved: boolean
  createdAt: string
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-px text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 12 12"
          fill={i < value ? 'currentColor' : 'transparent'}
          stroke="currentColor" strokeWidth="0.8">
          <path d="M 6 1 L 7.4 4.4 L 11 4.6 L 8.2 7 L 9.1 10.6 L 6 8.7 L 2.9 10.6 L 3.8 7 L 1 4.6 L 4.6 4.4 Z" />
        </svg>
      ))}
    </span>
  )
}

export default function ResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/reviews')
    setReviews(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function approve(id: string) {
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true }),
    })
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r))
  }

  async function reject(id: string) {
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: false }),
    })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const pending  = reviews.filter(r => !r.approved)
  const approved = reviews.filter(r => r.approved)

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground mb-6">
        Reseñas ({reviews.length})
      </h1>

      {loading && <p className="text-muted-foreground font-sans text-sm">Cargando...</p>}

      {!loading && (
        <>
          {pending.length > 0 && (
            <section className="mb-8">
              <h2 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Pendientes ({pending.length})
              </h2>
              <div className="flex flex-col gap-3">
                {pending.map(r => (
                  <div key={r.id} className="bg-background border border-border rounded-xl p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Stars value={r.rating} />
                        <span className="font-sans font-medium text-sm text-foreground">{r.name}</span>
                        <span className="text-xs text-muted-foreground">· {r.productSlug}</span>
                      </div>
                      <p className="font-sans text-sm text-muted-foreground line-clamp-3">{r.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(r.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approve(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-sans font-medium hover:bg-emerald-100 transition-colors"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => reject(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-sans font-medium hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pending.length === 0 && (
            <p className="text-muted-foreground font-sans text-sm mb-8">No hay reseñas pendientes.</p>
          )}

          {approved.length > 0 && (
            <section>
              <h2 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Publicadas ({approved.length})
              </h2>
              <div className="flex flex-col gap-3">
                {approved.map(r => (
                  <div key={r.id} className="bg-background border border-border rounded-xl p-4 flex items-start justify-between gap-4 opacity-70">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Stars value={r.rating} />
                        <span className="font-sans font-medium text-sm text-foreground">{r.name}</span>
                        <span className="text-xs text-muted-foreground">· {r.productSlug}</span>
                      </div>
                      <p className="font-sans text-sm text-muted-foreground line-clamp-3">{r.comment}</p>
                    </div>
                    <button
                      onClick={() => reject(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-sans font-medium hover:bg-red-100 transition-colors shrink-0"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
