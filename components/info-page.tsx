import Link from 'next/link'
import { SectionHeading } from '@/components/ornament'
import { primaryCta } from '@/lib/styles'

interface InfoPageProps {
  eyebrow: string
  title: string
  script: string
  sections: { heading: string; body: string }[]
  ctaLabel: string
}

export function InfoPage({ eyebrow, title, script, sections, ctaLabel }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeading eyebrow={eyebrow} title={title} script={script} />
      <div className="mt-14 space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-serif text-2xl text-olive-deep">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-charcoal/85">{s.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link href="/#contact" className={primaryCta}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}
