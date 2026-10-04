import { Hero } from '@/components/hero'
import { AvailableGallery } from '@/components/available-gallery'
import { PortfolioLightbox } from '@/components/portfolio-lightbox'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { SectionHeading } from '@/components/ornament'
import { FadeIn } from '@/components/fade-in'
import { getPaintingBySlug, getPaintings, getPaintingsBySeries } from '@/lib/paintings'
import { serializeJsonLd, siteJsonLd } from '@/lib/json-ld'

export default async function HomePage() {
  const [paintings, series, heroPainting] = await Promise.all([
    getPaintings(),
    getPaintingsBySeries(),
    getPaintingBySlug('summer-clouds-over-the-lake'),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd(paintings)) }} />

      {heroPainting && <Hero painting={heroPainting} />}

      <section id="available" aria-labelledby="available-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            id="available-title"
            eyebrow="The collection"
            title="Available Art"
            script="Original oil paintings"
            description="Each painting is one of a kind, signed and ready to hang. Buy directly on Etsy, or send me a note with any questions."
          />
          <FadeIn className="mt-12">
            <AvailableGallery paintings={paintings} />
          </FadeIn>
        </div>
      </section>

      <AboutSection />

      <section id="portfolio" aria-labelledby="portfolio-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            id="portfolio-title"
            eyebrow="Body of work"
            title="Portfolio"
            script="Series & studies"
            description="A look at past and present work, gathered by series. Tap any painting to see it larger."
          />
          <FadeIn className="mt-16">
            <PortfolioLightbox groups={series} />
          </FadeIn>
        </div>
      </section>

      <div className="border-t border-beige/70">
        <ContactSection paintings={paintings} />
      </div>
    </>
  )
}
