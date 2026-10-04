import Link from 'next/link'
import { navLinks, siteConfig } from '@/lib/site'
import { InstagramIcon, EtsyIcon } from '@/components/social-icons'
import { MobileNav } from '@/components/mobile-nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-beige/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2" aria-label={`${siteConfig.name} — home`}>
          <span className="font-serif text-xl tracking-[0.18em] text-olive-deep uppercase sm:text-2xl">
            {siteConfig.name}
          </span>
          <span className="font-script text-2xl leading-none text-gold sm:text-3xl" aria-hidden="true">
            Art
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-medium tracking-[0.22em] text-charcoal/80 uppercase transition-colors hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-beige" aria-hidden="true" />
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive transition-colors hover:text-olive-deep"
            >
              <InstagramIcon className="size-[18px]" />
              <span className="sr-only">Instagram (opens in a new tab)</span>
            </a>
            <a
              href={siteConfig.etsyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive transition-colors hover:text-olive-deep"
            >
              <EtsyIcon className="size-[18px]" />
              <span className="sr-only">Etsy shop (opens in a new tab)</span>
            </a>
          </div>
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
