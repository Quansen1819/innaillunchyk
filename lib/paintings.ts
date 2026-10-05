import paintingsData from '@/data/paintings.json'
import blurData from '@/data/blur-placeholders.json'

export type PaintingStatus = 'available' | 'sold' | 'reserved'
export type PaintingCategory = 'ALL' | 'SKY & CLOUDS' | 'WATER' | 'LANDSCAPES' | 'FLORALS'

export const CATEGORIES: PaintingCategory[] = ['ALL', 'SKY & CLOUDS', 'WATER', 'LANDSCAPES', 'FLORALS']

/** Used by next/image when a new painting has no stored pixel size yet. */
export const FALLBACK_IMAGE_WIDTH = 1600
export const FALLBACK_IMAGE_HEIGHT = 2000

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
  imageWidth?: number
  imageHeight?: number
  imageAlt: string
  description: string
  tags?: string[]
  materials?: string
  etsyUrl?: string
  blurDataURL?: string
}

type RawPainting = {
  id?: string
  slug?: string
  title: string
  year?: number
  medium?: string
  widthIn?: number
  heightIn?: number
  price?: number
  currency?: string
  status?: PaintingStatus
  category?: string
  series?: string
  image: string
  images?: string[]
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
  description?: string
  tags?: string[]
  materials?: string
  etsyUrl?: string
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
const CURRENT_YEAR = new Date().getFullYear()

/**
 * Existing paintings store full https:// URLs. New uploads are site paths
 * such as /images/paintings/photo.jpg. Keep both working.
 */
export function resolveImage(src: string): string {
  if (!src) return src
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `/${src}`
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return slug || 'painting'
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base
  let n = 2
  while (used.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  used.add(slug)
  return slug
}

function nextIdAllocator(items: RawPainting[]): () => string {
  let max = 0
  for (const item of items) {
    const match = item.id?.match(/^p-(\d+)$/i)
    if (match) max = Math.max(max, Number.parseInt(match[1], 10))
  }
  return () => {
    max += 1
    return `p-${String(max).padStart(3, '0')}`
  }
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizePaintings(raw: RawPainting[]): Painting[] {
  const usedSlugs = new Set<string>()
  for (const item of raw) {
    if (hasText(item.slug)) usedSlugs.add(item.slug.trim())
  }
  const allocateId = nextIdAllocator(raw)

  return raw.map((item) => {
    const title = item.title?.trim() || 'Untitled'
    const category = hasText(item.category) ? item.category.trim() : 'landscapes'
    const id = hasText(item.id) ? item.id.trim() : allocateId()
    const slug = hasText(item.slug) ? item.slug.trim() : uniqueSlug(slugifyTitle(title), usedSlugs)
    const imageAlt = hasText(item.imageAlt)
      ? item.imageAlt.trim()
      : `${title}, ${category} oil painting by Inna Iliychuk`
    const image = resolveImage(item.image)
    const images = Array.isArray(item.images) ? item.images.filter(Boolean).map(resolveImage) : undefined
    const categories = getPaintingCategories(item)

    return {
      ...item,
      id,
      slug,
      title,
      year: item.year || CURRENT_YEAR,
      medium: hasText(item.medium) ? item.medium : 'Oil on Canvas',
      widthIn: item.widthIn || 0,
      heightIn: item.heightIn || 0,
      price: item.price || 0,
      currency: hasText(item.currency) ? item.currency : 'USD',
      status: item.status || 'available',
      category: categories[0],
      categories,
      series: hasText(item.series) ? item.series : 'Selected Works',
      image,
      images,
      imageAlt,
      description: item.description || '',
      materials: hasText(item.materials) ? item.materials : 'Stretched canvas',
      etsyUrl: hasText(item.etsyUrl) ? item.etsyUrl.trim() : undefined,
      blurDataURL: blurs[item.image?.split('/').pop() ?? ''],
    }
  })
}

function getPaintingCategories(item: RawPainting): PaintingCategory[] {
  const result = new Set<PaintingCategory>()
  const rawCat = (item.category || '').toString().toUpperCase()
  const title = (item.title || '').toLowerCase()
  const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : ''

  if (rawCat.includes('SKY') || rawCat.includes('CLOUD')) result.add('SKY & CLOUDS')
  if (rawCat.includes('WATER') || rawCat.includes('SEA') || rawCat.includes('OCEAN')) result.add('WATER')
  if (rawCat.includes('FLORAL') || rawCat.includes('FLOWER')) result.add('FLORALS')
  if (rawCat.includes('LANDSCAPE')) result.add('LANDSCAPES')

  if (title.includes('cloud') || title.includes('sky') || tags.includes('clouds') || tags.includes('sky')) {
    result.add('SKY & CLOUDS')
  }
  if (title.includes('water') || title.includes('ocean') || title.includes('sea') || title.includes('lake') || title.includes('river') || tags.includes('ocean') || tags.includes('seascape')) {
    result.add('WATER')
  }
  if (title.includes('flower') || title.includes('rose') || title.includes('peony') || title.includes('floral') || tags.includes('floral') || tags.includes('peonies')) {
    result.add('FLORALS')
  }

  if (result.size === 0) {
    result.add('LANDSCAPES')
  }

  return Array.from(result)
}

const paintings: Painting[] = loadPaintingsFromData()

function loadPaintingsFromData(): Painting[] {
  return normalizePaintings(paintingsData as RawPainting[])
}

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
