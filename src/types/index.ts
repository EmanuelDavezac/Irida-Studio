export type Category =
  | 'stickers'
  | 'agenditas'
  | 'cumpleanos'
  | 'fotitos'
  | 'llaveros'
  | 'emprendimiento'
  | 'albumes'
  | 'a-pintar'

export const CATEGORY_LABELS: Record<Category, string> = {
  stickers: 'Stickers',
  agenditas: 'Agenditas',
  cumpleanos: 'Cumpleaños',
  fotitos: 'Fotitos',
  llaveros: 'Llaveros',
  emprendimiento: 'Emprendimiento',
  albumes: 'Álbumes',
  'a-pintar': '¡A pintar!',
}

export interface Variant {
  id: string
  name: string
  price?: number
}

export interface Product {
  id: string
  slug: string
  name: string
  price: number | null
  shortDescription: string
  description: string
  category: Category
  images: string[]
  featured: boolean
  variants?: Variant[]
  inStock: boolean
}

export interface CartItem {
  id: string
  product: Product
  variant?: Variant
  quantity: number
}
