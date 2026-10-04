'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { navLinks, siteConfig } from '@/lib/site'
import { InstagramIcon, EtsyIcon } from '@/components/social-icons'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-sm text-olive-deep hover:bg-ivory md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm bg-cream">
        <SheetHeader className="px-6 pt-8">
          <SheetTitle className="font-serif text-2xl font-normal tracking-[0.15em] text-olive-deep uppercase">
            {siteConfig.name}
          </SheetTitle>
          <SheetDescription className="font-script text-2xl text-gold">Oil Paintings</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-beige py-4 font-serif text-2xl text-charcoal transition-colors hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-6 px-6 pb-10 text-olive">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
            <InstagramIcon className="size-5" />
            {siteConfig.instagramHandle}
          </a>
          <a href={siteConfig.etsyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
            <EtsyIcon className="size-5" />
            Etsy
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
