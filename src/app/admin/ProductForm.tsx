'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { X, Upload, Plus } from 'lucide-react'

interface Variant {
  name: string
  price: string
}

interface CategoryOption {
  id: string
  slug: string
  label: string
}

interface Props {
  categories: CategoryOption[]
  initial?: {
    id: string
    name: string
    price: number | null
    shortDescription: string
    description: string | null
    category: string
    images: string[]
    featured: boolean
    inStock: boolean
    variants: { name: string; price: number | null }[]
  }
}

export default function ProductForm({ initial, categories }: Props) {
  const router = useRouter()
  const isEdit = !!initial
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [inStock, setInStock] = useState(initial?.inStock ?? true)
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants.map((v) => ({ name: v.name, price: v.price?.toString() ?? '' })) ?? []
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setImages((prev) => [...prev, data.url])
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { name: '', price: '' }])
  }

  function updateVariant(i: number, field: keyof Variant, value: string) {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)))
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = {
      name,
      price: price || null,
      shortDescription,
      description,
      category,
      images,
      featured,
      inStock,
      variants: variants.filter((v) => v.name).map((v) => ({ name: v.name, price: v.price || null })),
    }

    const url = isEdit ? `/api/admin/productos/${initial.id}` : '/api/admin/productos'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSaving(false)
    if (!res.ok) {
      setError('Error al guardar. Revisá los campos.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div>
        <label className="block font-sans text-xs text-muted-foreground mb-1">Nombre *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Short description */}
      <div>
        <label className="block font-sans text-xs text-muted-foreground mb-1">
          Descripción corta * <span className="text-xs">(máx. 160 caracteres, aparece en la grilla)</span>
        </label>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
          maxLength={160}
          rows={2}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-sans text-xs text-muted-foreground mb-1">
          Descripción completa <span className="text-xs">(aparece en la página del producto)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs text-muted-foreground mb-1">
            Precio (ARS) <span className="text-xs">(dejá vacío si no tiene)</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block font-sans text-xs text-muted-foreground mb-1">Categoría *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Elegí una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="font-sans text-sm text-foreground">En stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="font-sans text-sm text-foreground">Destacado en el home</span>
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="block font-sans text-xs text-muted-foreground mb-2">Imágenes</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url) => (
            <div key={url} className="relative group">
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-border" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span className="text-xs">{uploading ? '...' : 'Subir'}</span>
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-sans text-xs text-muted-foreground">
            Variantes <span className="text-xs">(opcional — ej: talle, color)</span>
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={v.name}
                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                placeholder="Nombre (ej: Talle S)"
                className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="number"
                value={v.price}
                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                placeholder="Precio (opcional)"
                className="w-32 border border-border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
