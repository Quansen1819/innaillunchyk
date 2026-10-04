import Link from 'next/link'
import { navLinks, siteConfig } from '@/lib/site'
import { SprigDivider } from '@/components/ornament'
import { InstagramIcon, EtsyIcon } from '@/components/social-icons'

export function SiteFooter() {
  return (
    <footer className="border-t border-beige bg-ivory/60">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
        <p className="font-serif text-2xl tracking-[0.2em] text-olive-deep uppercase">{siteConfig.name}</p>
        <p className="font-script text-3xl text-gold">Original Oil Paintings</p>
        <SprigDivider className="mt-5" />

        <nav aria-label="Footer" className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[...navLinks, { href: '/commissions', label: 'Commissions' }, { href: '/shipping', label: 'Shipping & Returns' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] tracking-[0.2em] text-charcoal/75 uppercase transition-colors hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex justify-center gap-5 text-olive">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olive-deep">
            <InstagramIcon className="size-5" />
            <span className="sr-only">Instagram (opens in a new tab)</span>
          </a>
          <a href={siteConfig.etsyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-olive-deep">
            <EtsyIcon className="size-5" />
            <span className="sr-only">Etsy shop (opens in a new tab)</span>
          </a>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All artwork and images are copyright of the artist.
        </p>
      </div>
    </footer>
  )
}
