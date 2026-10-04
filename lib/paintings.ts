import paintingsData from '@/data/paintings.json'
import blurData from '@/data/blur-placeholders.json'

export type PaintingStatus = 'available' | 'sold' | 'reserved'
export type PaintingCategory = 'ALL' | 'SKY & CLOUDS' | 'WATER' | 'LANDSCAPES' | 'FLORALS'

export const CATEGORIES: PaintingCategory[] = ['ALL', 'SKY & CLOUDS', 'WATER', 'LANDSCAPES', 'FLORALS']

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
  ALL: 'All',
  'SKY & CLOUDS': 'Sky & Clouds',
  WATER: 'Water',
  LANDSCAPES: 'Landscapes',
  FLORALS: 'Florals',
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
    category: (painting.category?.toString().toUpperCase() as PaintingCategory) || 'ALL',
    blurDataURL: blurs[painting.image.split('/').pop() ?? ''],
  }),
)

export async function getPaintings(): Promise<Painting[]> {
  return paintings
}

export async function getPaintingBySlug(slug: string): Promise<Painting | undefined> {
  return paintings.find((painting) => painting.slug === slug)
}

// Повертає першу картину з імпортованого списку Etsy для Hero-блоку на головній
export async function getFeaturedPainting(): Promise<Painting | undefined> {
  return paintings[0]
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