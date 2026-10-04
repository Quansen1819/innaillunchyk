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
                src="/images/artist-studio.png"
                alt="Inna Iliychuk's sunlit Chicago studio with an easel, oil paints and fresh flowers"
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
              I grew up in Ukraine, surrounded by birch groves, sunflower fields and my grandmother&apos;s garden. Those
              colors stayed with me when I moved to Chicago, and today they find their way into almost every canvas I
              paint.
            </p>
            <p>
              I paint in oil because it is slow and forgiving. It lets me build light in thin, glowing layers, the way
              morning light builds over a forest stream or across Lake Michigan. My subjects are simple: landscapes,
              flowers and quiet still lifes, the small, beautiful things we often walk past.
            </p>
            <p>
              Every painting is made by hand, one at a time, in my home studio. I hope each one brings a little calm and
              warmth into the home where it ends up.
            </p>
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
