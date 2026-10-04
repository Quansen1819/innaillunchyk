'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { Heart } from 'lucide-react'
import { SprigDivider } from '@/components/ornament'
import { primaryCta, outlineCta } from '@/lib/styles'
import type { Painting } from '@/lib/paintings'

export function Hero({ painting }: { painting: Painting }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-16 sm:px-8 md:grid-cols-[1.05fr_1fr] md:gap-6 md:pt-16 md:pb-24 lg:gap-12">
        <motion.div
          className="order-2 text-center md:order-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 id="hero-title" className="font-serif text-5xl leading-none font-normal tracking-[0.06em] text-olive-deep uppercase sm:text-6xl lg:text-7xl">
            Original Art
          </h1>
          <SprigDivider className="mt-7" />
          <p className="mt-7 text-xs font-medium tracking-[0.28em] text-gold uppercase sm:text-sm">
          INSPIRED BY LIGHT, SKY & NATURE
          </p>
          <span className="mx-auto mt-5 block h-px w-10 bg-gold/50" aria-hidden="true" />
          <p className="mt-3 font-script text-5xl text-olive-deep sm:text-6xl">Oil Paintings</p>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Original oil paintings by Ukrainian-born artist Inna Iliychuk, created by hand in her Chicago studio.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/#available" className={primaryCta}>
              View Available Art
            </Link>
            <Link href="/#about" className={outlineCta}>
              About the Artist
            </Link>
          </div>
          <Heart className="mx-auto mt-10 size-4 fill-gold text-gold" aria-hidden="true" />
        </motion.div>

        <motion.div
          className="order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ y: imageY }} className="feathered relative mx-auto aspect-[4/5] w-full max-w-md md:max-w-none">
            <Image
              src={painting.image}
              alt={painting.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder={painting.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={painting.blurDataURL}
              className="object-cover"
            />
          </motion.div>
          <p className="mt-2 text-center text-xs tracking-wide text-muted-foreground italic">
            <span className="font-serif text-sm">{painting.title}</span>, {painting.medium.toLowerCase()}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
