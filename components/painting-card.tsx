import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { primaryCta, outlineCta } from '@/lib/styles'
import {
  FALLBACK_IMAGE_HEIGHT,
  FALLBACK_IMAGE_WIDTH,
  formatDimensions,
  formatPrice,
  resolveImage,
  statusLabels,
  type Painting,
} from '@/lib/paintings'

export function StatusBadge({ status, className }: { status: Painting['status']; className?: string }) {
  return (
    <Badge
      className={cn(
        'rounded-sm px-2.5 py-0.5 text-[0.65rem] font-medium tracking-[0.18em] uppercase',
        status === 'available' && 'bg-olive text-primary-foreground',
        status === 'reserved' && 'bg-gold text-primary-foreground',
        status === 'sold' && 'bg-charcoal/80 text-cream',
        className,
      )}
    >
      {statusLabels[status]}
    </Badge>
  )
}

export function PaintingCard({ painting, priority = false }: { painting: Painting; priority?: boolean }) {
  const isSold = painting.status === 'sold'

  return (
    <article className="group mb-8 break-inside-avoid" aria-labelledby={`${painting.slug}-title`}>
      <Link
        href={`/art/${painting.slug}`}
        className="relative block overflow-hidden rounded-sm bg-ivory shadow-[0_1px_2px_rgba(46,46,42,0.06),0_12px_32px_-16px_rgba(46,46,42,0.25)] ring-1 ring-beige/60"
      >
        <Image
          src={resolveImage(painting.image)}
          alt={painting.imageAlt}
          width={painting.imageWidth ?? FALLBACK_IMAGE_WIDTH}
          height={painting.imageHeight ?? FALLBACK_IMAGE_HEIGHT}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholder={painting.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={painting.blurDataURL}
          className={cn(
            'h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]',
            isSold && 'saturate-[0.85]',
          )}
        />
        <StatusBadge status={painting.status} className="absolute top-3 left-3" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent px-4 pt-10 pb-3 text-[0.65rem] tracking-[0.22em] text-cream uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          View details
        </span>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 id={`${painting.slug}-title`} className="font-serif text-2xl leading-tight text-charcoal">
            {painting.title}
          </h3>
          <p className="mt-1 text-xs tracking-wide text-muted-foreground">
            {painting.medium} · {formatDimensions(painting)} · {painting.year}
          </p>
        </div>
        <p className={cn('shrink-0 font-serif text-xl text-olive-deep', isSold && 'text-muted-foreground line-through decoration-1')}>
          {formatPrice(painting)}
        </p>
      </div>

      {isSold ? (
        <p className="mt-4 text-sm text-muted-foreground">
          This piece has found its home.{' '}
          <Link href="/commissions" className="text-olive underline underline-offset-4 hover:text-olive-deep">
            Commission something similar
          </Link>
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/?painting=${painting.slug}#contact`} scroll={false} className={cn(outlineCta, 'h-10 flex-1')}>
            Inquire
          </Link>
          {painting.status === 'available' && painting.etsyUrl && (
            <a
              href={painting.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(primaryCta, 'h-10 flex-1')}
            >
              Buy on Etsy
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </article>
  )
}
