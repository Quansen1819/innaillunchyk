import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ZoomableImage } from '@/components/zoomable-image'
import { PaintingCard, StatusBadge } from '@/components/painting-card'
import { SprigDivider } from '@/components/ornament'
import { formatDimensions, formatPrice, getPaintingBySlug, getPaintings, categoryLabels } from '@/lib/paintings'
import { artworkJsonLd, serializeJsonLd } from '@/lib/json-ld'
import { primaryCta, outlineCta } from '@/lib/styles'
import { cn } from '@/lib/utils'

export async function generateStaticParams() {
  const paintings = await getPaintings()
  return paintings.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/art/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const painting = await getPaintingBySlug(slug)
  if (!painting) return {}
  const title = `${painting.title}, ${painting.medium} (${painting.year})`
  return {
    title,
    description: painting.description,
    alternates: { canonical: `/art/${painting.slug}` },
    openGraph: {
      title,
      description: painting.description,
      images: [{ url: painting.image, width: painting.imageWidth, height: painting.imageHeight, alt: painting.imageAlt }],
    },
  }
}

export default async function PaintingPage({ params }: PageProps<'/art/[slug]'>) {
  const { slug } = await params
  const [painting, all] = await Promise.all([getPaintingBySlug(slug), getPaintings()])
  if (!painting) notFound()

  const related = all.filter((p) => p.id !== painting.id && p.category === painting.category && p.status !== 'sold').slice(0, 3)

  const details = [
    ['Medium', painting.medium],
    ['Size', formatDimensions(painting)],
    ['Year', String(painting.year)],
    ['Subject', categoryLabels[painting.category]],
    ['Series', painting.series],
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', ...artworkJsonLd(painting) }) }}
      />
      <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-16">
        <Link
          href="/#available"
          className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase hover:text-olive"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to gallery
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ZoomableImage painting={painting} />

          <div className="lg:pt-6">
            <StatusBadge status={painting.status} />
            <h1 className="mt-4 font-serif text-5xl leading-tight font-normal text-olive-deep">{painting.title}</h1>
            <p className="mt-2 font-serif text-3xl text-charcoal">
              <span className={cn(painting.status === 'sold' && 'text-muted-foreground line-through decoration-1')}>
                {formatPrice(painting)}
              </span>
            </p>
            <SprigDivider className="mt-6 justify-start [&>span:first-child]:hidden" />
            <p className="mt-6 leading-relaxed text-charcoal/85">{painting.description}</p>

            <dl className="mt-8 divide-y divide-beige border-y border-beige">
              {details.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">{term}</dt>
                  <dd className="text-right text-charcoal">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {painting.status === 'available' && (
                <a href={painting.etsyUrl} target="_blank" rel="noopener noreferrer" className={cn(primaryCta, 'flex-1')}>
                  Buy on Etsy
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {painting.status === 'sold' ? (
                <Link href="/commissions" className={cn(primaryCta, 'flex-1')}>
                  Commission a similar piece
                </Link>
              ) : (
                <Link href={`/?painting=${painting.slug}#contact`} className={cn(outlineCta, 'flex-1')}>
                  Inquire about this piece
                </Link>
              )}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Signed original, varnished and ready to hang. Ships carefully packed from Chicago.{' '}
              <Link href="/shipping" className="underline underline-offset-4 hover:text-olive">
                Shipping details
              </Link>
            </p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-beige bg-ivory/50 py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 id="related-title" className="text-center font-serif text-4xl text-olive-deep">
              You may also love
            </h2>
            <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
              {related.map((p) => (
                <PaintingCard key={p.id} painting={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
