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
  (painting) => {
    const textToSearch = `${painting.title || ''} ${(painting.tags || []).join(' ')} ${painting.description || ''}`.toLowerCase()

    let computedCategory: PaintingCategory = 'LANDSCAPES'

    if (textToSearch.includes('cloud') || textToSearch.includes('sky') || textToSearch.includes('sun') || textToSearch.includes('sunset')) {
      computedCategory = 'SKY & CLOUDS'
    } else if (textToSearch.includes('water') || textToSearch.includes('ocean') || textToSearch.includes('sea') || textToSearch.includes('lake') || textToSearch.includes('river') || textToSearch.includes('pond') || textToSearch.includes('wave') || textToSearch.includes('coastal')) {
      computedCategory = 'WATER'
    } else if (textToSearch.includes('flower') || textToSearch.includes('floral') || textToSearch.includes('rose') || textToSearch.includes('peony') || textToSearch.includes('bouquet') || textToSearch.includes('garden')) {
      computedCategory = 'FLORALS'
    }

    return {
      ...painting,
      category: computedCategory,
      blurDataURL: blurs[painting.image?.split('/').pop() ?? ''],
    }
  },
)

export async function getPaintings(): Promise<Painting[]> {
  return paintings
}

export async function getPaintingBySlug(slug: string): Promise<Painting | undefined> {
  return paintings.find((painting) => painting.slug === slug)
}

export async function getFeaturedPainting(): Promise<Painting | undefined> {
  return paintings.find((p) => p.image) ?? paintings[0]
}

export async function getPaintingsBySeries(): Promise<{ series: string; paintings: Painting[] }[]> {
  const groups = new Map<string, Painting[]>()
  for (const painting of paintings) {
    const seriesName = painting.series || 'Selected Works'
    const list = groups.get(seriesName) ?? []
    list.push(painting)
    groups.set(seriesName, list)
  }
  return Array.from(groups, ([series, items]) => ({ series, paintings: items }))
}

export function formatPrice(painting: Pick<Painting, 'price' | 'currency'>) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: painting.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(painting.price || 0)
}

export function formatDimensions(painting: Pick<Painting, 'widthIn' | 'heightIn'>) {
  return `${painting.widthIn} × ${painting.heightIn} in`
}