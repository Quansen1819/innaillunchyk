import paintingsData from '@/data/paintings.json'
import blurData from '@/data/blur-placeholders.json'

export type PaintingStatus = 'available' | 'sold' | 'reserved'
export const CATEGORIES = ['ALL', 'SKY & CLOUDS', 'WATER', 'LANDSCAPES', 'FLORALS'];

export interface Painting {
  id: string
  slug: string
  title: string
  year: number
  medium: string
  widthIn: number
  heightIn: number
  price: number
  currency: string
  status: PaintingStatus
  category: PaintingCategory
  series: string
  image: string
  images?: string[]
  imageWidth: number
  imageHeight: number
  imageAlt: string
  description: string
  tags?: string[]
  materials?: string
  etsyUrl: string
  blurDataURL?: string
}

export const categoryLabels: Record<PaintingCategory, string> = {
  landscapes: 'Landscapes',
  florals: 'Florals',
  'still-life': 'Still Life',
}

export const statusLabels: Record<PaintingStatus, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
}

const blurs = blurData as Record<string, string>

const paintings: Painting[] = (paintingsData as Omit<Painting, 'blurDataURL'>[]).map(
  (painting) => ({
    ...painting,
    blurDataURL: blurs[painting.image.split('/').pop() ?? ''],
  }),
)

// Single data access point: swap these implementations for a CMS (e.g. Sanity) later.
export async function getPaintings(): Promise<Painting[]> {
  return paintings
}

export async function getFeaturedPainting(): Promise<Painting | undefined> {
  return (
    paintings.find((painting) => painting.slug === 'coastal-seascape-with-dramatic-sky') ?? paintings[0]
  )
}

export async function getPaintingsBySeries(): Promise<{ series: string; paintings: Painting[] }[]> {
  const groups = new Map<string, Painting[]>()
  for (const painting of paintings) {
    const list = groups.get(painting.series) ?? []
    list.push(painting)
    groups.set(painting.series, list)
  }
  return Array.from(groups, ([series, items]) => ({ series, paintings: items }))
}

export function formatPrice(painting: Pick<Painting, 'price' | 'currency'>) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: painting.currency,
    maximumFractionDigits: 0,
  }).format(painting.price)
}

export function formatDimensions(painting: Pick<Painting, 'widthIn' | 'heightIn'>) {
  return `${painting.widthIn} × ${painting.heightIn} in`
}
