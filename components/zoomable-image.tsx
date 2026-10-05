'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FALLBACK_IMAGE_HEIGHT, FALLBACK_IMAGE_WIDTH, resolveImage, type Painting } from '@/lib/paintings'

export function ZoomableImage({ painting }: { painting: Painting }) {
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed((z) => !z)}
        onPointerMove={zoomed ? handleMove : undefined}
        onPointerLeave={() => setZoomed(false)}
        aria-pressed={zoomed}
        aria-label={zoomed ? 'Zoom out of painting' : 'Zoom in to see brushstroke detail'}
        className={cn(
          'relative block w-full overflow-hidden rounded-sm bg-ivory shadow-[0_30px_60px_-30px_rgba(46,46,42,0.45)] ring-1 ring-beige/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
        )}
      >
        <Image
          src={resolveImage(painting.image)}
          alt={painting.imageAlt}
          width={painting.imageWidth ?? FALLBACK_IMAGE_WIDTH}
          height={painting.imageHeight ?? FALLBACK_IMAGE_HEIGHT}
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          placeholder={painting.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={painting.blurDataURL}
          style={{ transformOrigin: origin }}
          className={cn('h-auto w-full transition-transform duration-300 ease-out', zoomed && 'scale-[2.2]')}
        />
      </button>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        {zoomed ? <ZoomOut className="size-3.5" aria-hidden="true" /> : <ZoomIn className="size-3.5" aria-hidden="true" />}
        {zoomed ? 'Move to explore · click to zoom out' : 'Click the painting to see brushstroke detail'}
      </p>
    </div>
  )
}
