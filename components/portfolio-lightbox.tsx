'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { formatDimensions, type Painting } from '@/lib/paintings'

interface PortfolioProps {
  groups: { series: string; paintings: Painting[] }[]
}

export function PortfolioLightbox({ groups }: PortfolioProps) {
  const all = groups.flatMap((g) => g.paintings)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex === null ? null : all[activeIndex]

  const step = (delta: number) =>
    setActiveIndex((i) => (i === null ? i : (i + delta + all.length) % all.length))

  return (
    <>
      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.series} aria-labelledby={`series-${group.series}`}>
            <div className="mb-6 flex items-baseline gap-4">
              <h3 id={`series-${group.series}`} className="font-serif text-3xl text-olive-deep italic">
                {group.series}
              </h3>
              <span className="h-px flex-1 bg-beige" aria-hidden="true" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {group.paintings.length} {group.paintings.length === 1 ? 'work' : 'works'}
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {group.paintings.map((painting) => (
                <li key={painting.id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(all.indexOf(painting))}
                    className="group relative block aspect-square w-full overflow-hidden rounded-sm bg-ivory ring-1 ring-beige/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Image
                      src={painting.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      placeholder={painting.blurDataURL ? 'blur' : 'empty'}
                      blurDataURL={painting.blurDataURL}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent px-3 pt-8 pb-2 text-left font-serif text-base text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {painting.title}
                    </span>
                    <span className="sr-only">
                      View {painting.title}, {painting.year}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          className="max-h-[95dvh] w-[min(96vw,1100px)] max-w-none gap-0 overflow-y-auto border-beige bg-cream p-0 sm:max-w-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') step(1)
            if (e.key === 'ArrowLeft') step(-1)
          }}
        >
          {active && (
            <div className="grid md:grid-cols-[1fr_280px]">
              <div className="relative flex items-center justify-center bg-ivory p-4 sm:p-8">
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.imageAlt}
                  width={active.imageWidth}
                  height={active.imageHeight}
                  sizes="(min-width: 768px) 800px, 96vw"
                  placeholder={active.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={active.blurDataURL}
                  className="h-auto max-h-[75dvh] w-auto object-contain shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-between gap-6 p-6">
                <div>
                  <p className="text-[0.65rem] tracking-[0.25em] text-gold uppercase">{active.series}</p>
                  <DialogTitle className="mt-2 font-serif text-3xl font-normal text-charcoal">{active.title}</DialogTitle>
                  <DialogDescription className="mt-2 text-xs text-muted-foreground">
                    {active.medium} · {formatDimensions(active)} · {active.year}
                  </DialogDescription>
                  <p className="mt-4 text-sm leading-relaxed text-charcoal/80">{active.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="inline-flex size-10 items-center justify-center rounded-sm border border-beige text-olive-deep hover:bg-ivory"
                    aria-label="Previous painting"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {(activeIndex ?? 0) + 1} / {all.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="inline-flex size-10 items-center justify-center rounded-sm border border-beige text-olive-deep hover:bg-ivory"
                    aria-label="Next painting"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
