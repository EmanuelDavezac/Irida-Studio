'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import type { Product, Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import ProductCard from '@/components/products/ProductCard'
import { cn } from '@/lib/utils'

interface CatalogClientProps {
  products: Product[]
  initialCategory?: Category
}

const ALL = 'todos' as const
type FilterValue = Category | typeof ALL

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][]

export default function CatalogClient({
  products,
  initialCategory,
}: CatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState<FilterValue>(initialCategory ?? ALL)

  const filtered =
    active === ALL ? products : products.filter((p) => p.category === active)

  const handleFilter = useCallback(
    (cat: FilterValue) => {
      setActive(cat)
      if (cat === ALL) {
        router.push(pathname, { scroll: false })
      } else {
        router.push(`${pathname}?categoria=${cat}`, { scroll: false })
      }
    },
    [router, pathname]
  )

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-start gap-3 mb-10">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0 mt-2.5" />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
          <FilterPill
            label="Todos"
            active={active === ALL}
            onClick={() => handleFilter(ALL)}
          />
          {categories.map(([slug, label]) => (
            <FilterPill
              key={slug}
              label={label}
              active={active === slug}
              onClick={() => handleFilter(slug)}
            />
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="font-sans text-sm text-muted-foreground mb-8">
        {filtered.length === 0
          ? 'Sin productos'
          : `${filtered.length} ${filtered.length === 1 ? 'producto' : 'productos'}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 text-center"
        >
          <p className="font-serif text-2xl text-muted-foreground mb-2">
            Pronto disponible
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Estamos preparando productos para esta categoría.
          </p>
        </motion.div>
      )}
    </>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 px-4 py-2 rounded-full font-sans text-sm transition-all duration-200 whitespace-nowrap',
        active
          ? 'bg-foreground text-background shadow-sm'
          : 'border border-border text-muted-foreground hover:border-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}
