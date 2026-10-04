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
  categories: PaintingCategory[]
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

// Ручна або пряма нормалізація категорій на основі даних із файлу
function getPaintingCategories(item: any): PaintingCategory[] {
  const result = new Set<PaintingCategory>()
  const rawCat = (item.category || '').toString().toUpperCase()
  const title = (item.title || '').toLowerCase()
  const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : ''

  // 1. Пряма перевірка категорій з JSON
  if (rawCat.includes('SKY') || rawCat.includes('CLOUD')) result.add('SKY & CLOUDS')
  if (rawCat.includes('WATER') || rawCat.includes('SEA') || rawCat.includes('OCEAN')) result.add('WATER')
  if (rawCat.includes('FLORAL') || rawCat.includes('FLOWER')) result.add('FLORALS')
  if (rawCat.includes('LANDSCAPE')) result.add('LANDSCAPES')

  // 2. Якщо в JSON категорія застаріла або порожня — точна перевірка за ключовими тегами/назвою
  if (title.includes('cloud') || title.includes('sky') || tags.includes('clouds') || tags.includes('sky')) {
    result.add('SKY & CLOUDS')
  }
  if (title.includes('water') || title.includes('ocean') || title.includes('sea') || title.includes('lake') || title.includes('river') || tags.includes('ocean') || tags.includes('seascape')) {
    result.add('WATER')
  }
  if (title.includes('flower') || title.includes('rose') || title.includes('peony') || title.includes('floral') || tags.includes('floral') || tags.includes('peonies')) {
    result.add('FLORALS')
  }

  // 3. Якщо взагалі нічого не збіглося — відносимо до LANDSCAPES
  if (result.size === 0) {
    result.add('LANDSCAPES')
  }

  return Array.from(result)
}

const paintings: Painting[] = (paintingsData as Omit<Painting, 'blurDataURL' | 'categories'>[]).map(
  (painting) => {
    const categories = getPaintingCategories(painting)

    return {
      ...painting,
      categories,
      category: categories[0],
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