'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PaintingCard } from '@/components/painting-card'
import { categoryLabels, type Painting, type PaintingCategory } from '@/lib/paintings'

type Filter = 'all' | PaintingCategory

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...(Object.entries(categoryLabels) as [PaintingCategory, string][]).map(([value, label]) => ({ value, label })),
]

export function AvailableGallery({ paintings }: { paintings: Painting[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? paintings : paintings.filter((p) => p.category === filter)

  return (
    <div>
      <ToggleGroup
        value={[filter]}
        onValueChange={(value) => value[0] && setFilter(value[0] as Filter)}
        aria-label="Filter paintings by subject"
        className="mx-auto flex w-full flex-wrap justify-center gap-2"
      >
        {filters.map((f) => (
          <ToggleGroupItem
            key={f.value}
            value={f.value}
            className="h-9 rounded-sm border border-beige bg-transparent px-5 text-[0.7rem] font-medium tracking-[0.2em] text-charcoal/80 uppercase hover:bg-ivory data-[pressed]:border-olive data-[pressed]:bg-olive data-[pressed]:text-primary-foreground"
          >
            {f.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} paintings
      </p>

      <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((painting, index) => (
            <motion.div
              key={painting.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PaintingCard painting={painting} priority={index < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
