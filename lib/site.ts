export const siteConfig = {
  name: 'Inna Iliychuk',
  title: 'Inna Iliychuk — Original Oil Paintings',
  description:
    'Original oil paintings by Ukrainian-born, Chicago-based artist Inna Iliychuk. Landscapes, florals and still life — painted with love, inspired by nature.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
  email: 'inna.iliychuk@gmail.com',
  instagramHandle: '@Inna.Iliychuk.art',
  instagramUrl: 'https://instagram.com/Inna.Iliychuk.art',
  etsyUrl: 'https://www.etsy.com/shop/InnaIliychukArt',
  location: 'Chicago, Illinois',
} as const

export const navLinks = [
  { href: '/#available', label: 'Available Art' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const
