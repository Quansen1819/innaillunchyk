import Image from 'next/image'
import { FadeIn } from '@/components/fade-in'
import { SprigDivider } from '@/components/ornament'
import blurs from '@/data/blur-placeholders.json'

export function AboutSection() {
  const blur = (blurs as Record<string, string>)['artist-studio.png']

  return (
    <section id="about" aria-labelledby="about-title" className="bg-ivory/70 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
        <FadeIn>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-sm border border-gold/30 sm:-inset-4" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/family-image.jpg"
                alt="Inna Iliychuk in Chicago with her family"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                placeholder={blur ? 'blur' : 'empty'}
                blurDataURL={blur}
                className="object-cover"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">About the Artist</p>
          <h2 id="about-title" className="mt-4 font-serif text-4xl font-normal text-olive-deep sm:text-5xl">
            Inna Iliychuk
          </h2>
          <p className="font-script text-3xl text-gold" aria-hidden="true">
            from Ukraine to Chicago
          </p>
          <SprigDivider className="mt-4 justify-start [&>span:first-child]:hidden" />

          <div className="mt-6 space-y-5 text-[0.95rem] leading-relaxed text-charcoal/85">
            <p>
            Welcome to Inna Iliychuk Art. I`m Inna, an independent artist living and painting in the Chicago area.
            </p>
            <p>
            I create original oil paintings inspired by light, water, open skies, flowers, and the quiet beauty of nature.
            My work includes impressionist landscapes, seascapes, water scenes, floral paintings, and expressive interpretations of nature.
            </p>
            <p>
            Light and atmosphere are at the heart of my work. I`m especially drawn to reflections on water, luminous skies, clouds, flowers, and peaceful moments in nature. Through color and expressive brushwork, I aim to create paintings that bring a sense of warmth, calm, and space into a home.
            </p>
            <p>
            Each painting is an original, one-of-a-kind artwork created by hand. I enjoy allowing every piece to develop its own atmosphere while keeping light, color, and nature at the center of my work.</p>
            <p>My original paintings are available throughout the United States, with free U.S. shipping.</p>
          </div>

          <blockquote className="mt-8 border-l-2 border-gold/50 pl-5">
            <p className="font-serif text-2xl leading-snug text-olive-deep italic">
              {'“Nature is my teacher. I only try to listen carefully and paint what I hear.”'}
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  )
}
