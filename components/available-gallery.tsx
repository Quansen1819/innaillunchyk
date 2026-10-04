'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PaintingCard } from '@/components/painting-card'
import { CATEGORIES, categoryLabels, type Painting, type PaintingCategory } from '@/lib/paintings'

export function AvailableGallery({ paintings }: { paintings: Painting[] }) {
  const [filter, setFilter] = useState<PaintingCategory>('ALL')

  const visible = filter === 'ALL'
    ? paintings
    : paintings.filter((p) => p.categories?.includes(filter) || p.category === filter)

  return (
    <div>
      <ToggleGroup
        value={[filter]}
        onValueChange={(value) => value[0] && setFilter(value[0] as PaintingCategory)}
        aria-label="Filter paintings by subject"
        className="mx-auto flex w-full flex-wrap justify-center gap-2"
      >
        {CATEGORIES.map((cat) => (
          <ToggleGroupItem
            key={cat}
            value={cat}
            className="h-9 rounded-sm border border-beige bg-transparent px-5 text-[0.7rem] font-medium tracking-[0.2em] text-charcoal/80 uppercase hover:bg-ivory data-[pressed]:border-olive data-[pressed]:bg-olive data-[pressed]:text-primary-foreground"
          >
            {categoryLabels[cat] || cat}
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