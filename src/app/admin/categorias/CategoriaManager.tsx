'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  slug: string
  label: string
}

export default function CategoriaManager({ initial }: { initial: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(initial)
  const [newSlug, setNewSlug] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [error, setError] = useState('')

  async function handleAdd() {
    if (!newSlug.trim() || !newLabel.trim()) {
      setError('Completá nombre y etiqueta')
      return
    }
    setAdding(true)
    setError('')
    const res = await fetch('/api/admin/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: newSlug, label: newLabel }),
    })
    setAdding(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al crear')
      return
    }
    const created = await res.json()
    setCategories((prev) => [...prev, created])
    setNewSlug('')
    setNewLabel('')
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return
    await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    setCategories((prev) => prev.filter((c) => c.id !== id))
    router.refresh()
  }

  async function handleEdit(id: string) {
    if (!editLabel.trim()) return
    const res = await fetch(`/api/admin/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: editLabel }),
    })
    if (!res.ok) return
    const updated = await res.json()
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
    setEditingId(null)
    router.refresh()
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* List */}
      <div className="border border-border rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="font-sans text-sm text-muted-foreground p-6 text-center">
            Sin categorías. Agregá una abajo.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-4 py-3 bg-background">
                {editingId === cat.id ? (
                  <>
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      autoFocus
                      className="flex-1 border border-border rounded-lg px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={() => handleEdit(cat.id)} className="text-green-600 hover:text-green-700">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-sans text-sm text-foreground">{cat.label}</span>
                      <span className="font-sans text-xs text-muted-foreground ml-2">({cat.slug})</span>
                    </div>
                    <button
                      onClick={() => { setEditingId(cat.id); setEditLabel(cat.label) }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add form */}
      <div className="border border-border rounded-xl p-4 bg-background space-y-3">
        <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">Nueva categoría</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-sans text-xs text-muted-foreground mb-1">
              Slug <span className="text-muted-foreground">(URL, sin espacios)</span>
            </label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="ej: tarjetas"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-muted-foreground mb-1">
              Etiqueta <span className="text-muted-foreground">(visible)</span>
            </label>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="ej: Tarjetas"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={handleAdd} disabled={adding} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {adding ? 'Agregando...' : 'Agregar categoría'}
        </Button>
      </div>
    </div>
  )
}
