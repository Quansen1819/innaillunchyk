import { Suspense } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { FadeIn } from '@/components/fade-in'
import { SectionHeading } from '@/components/ornament'
import { InstagramIcon, EtsyIcon } from '@/components/social-icons'
import { siteConfig } from '@/lib/site'
import type { Painting } from '@/lib/paintings'

export function ContactSection({ paintings }: { paintings: Painting[] }) {
  const titles = Object.fromEntries(paintings.map((p) => [p.slug, p.title]))

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="contact-title"
          eyebrow="Get in touch"
          title="Contact & Inquiries"
          script="I'd love to hear from you"
          description="Questions about a painting, shipping, or a commission? Send a note and I will reply personally."
        />

        <FadeIn className="mt-14 grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div className="space-y-8">
            <ContactLink icon={<Mail className="size-5" strokeWidth={1.5} />} label="Email" href={`mailto:${siteConfig.email}`} value={siteConfig.email} />
            <ContactLink icon={<InstagramIcon className="size-5" />} label="Instagram" href={siteConfig.instagramUrl} value={siteConfig.instagramHandle} external />
            <ContactLink icon={<EtsyIcon className="size-5" />} label="Shop" href={siteConfig.etsyUrl} value="Etsy shop" external />
            <div className="flex items-start gap-4">
              <span className="mt-0.5 text-olive"><MapPin className="size-5" strokeWidth={1.5} aria-hidden="true" /></span>
              <div>
                <p className="text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase">Studio</p>
                <p className="mt-1 font-serif text-xl text-charcoal">{siteConfig.location}</p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-beige bg-card/60 p-6 shadow-[0_20px_50px_-30px_rgba(46,46,42,0.3)] sm:p-8">
            <Suspense fallback={null}>
              <ContactForm paintingTitles={titles} />
            </Suspense>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

interface ContactLinkProps {
  icon: React.ReactNode
  label: string
  href: string
  value: string
  external?: boolean
}

function ContactLink({ icon, label, href, value, external }: ContactLinkProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 text-olive" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase">{label}</p>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="mt-1 block font-serif text-xl break-all text-charcoal underline-offset-4 hover:text-olive hover:underline"
        >
          {value}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      </div>
    </div>
  )
}
