import { siteConfig } from '@/lib/site'
import { resolveImage, type Painting } from '@/lib/paintings'

const artist = {
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: 'Oil Painter',
  address: { '@type': 'PostalAddress', addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
  sameAs: [siteConfig.instagramUrl, siteConfig.etsyUrl],
}

export function artworkJsonLd(painting: Painting) {
  const imageSrc = resolveImage(painting.image)
  return {
    '@type': 'VisualArtwork',
    name: painting.title,
    url: `${siteConfig.url}/art/${painting.slug}`,
    image: imageSrc.startsWith('http') ? imageSrc : `${siteConfig.url}${imageSrc}`,
    description: painting.description,
    artform: 'Painting',
    artMedium: 'Oil',
    artworkSurface: 'Canvas',
    dateCreated: String(painting.year),
    width: { '@type': 'Distance', name: `${painting.widthIn} in` },
    height: { '@type': 'Distance', name: `${painting.heightIn} in` },
    creator: artist,
    offers: {
      '@type': 'Offer',
      price: painting.price,
      priceCurrency: painting.currency,
      availability:
        painting.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: painting.etsyUrl,
    },
  }
}

export function siteJsonLd(paintings: Painting[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [{ ...artist, '@id': `${siteConfig.url}/#artist` }, ...paintings.map(artworkJsonLd)],
  }
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
