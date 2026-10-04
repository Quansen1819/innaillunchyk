import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SprigDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-4 text-gold', className)} aria-hidden="true">
      <span className="h-px w-16 bg-gold/50 sm:w-24" />
      <span className="flex items-center gap-1">
        <Leaf className="size-3.5 -rotate-45 -scale-x-100" strokeWidth={1.25} />
        <Leaf className="size-4" strokeWidth={1.25} />
        <Leaf className="size-3.5 rotate-45" strokeWidth={1.25} />
      </span>
      <span className="h-px w-16 bg-gold/50 sm:w-24" />
    </div>
  )
}

interface SectionHeadingProps {
  eyebrow: string
  title: string
  script?: string
  description?: string
  id?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, script, description, id, className }: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-4 font-serif text-4xl font-normal text-olive-deep sm:text-5xl">
        {title}
      </h2>
      {script && (
        <p className="mt-1 font-script text-3xl text-gold sm:text-4xl" aria-hidden="true">
          {script}
        </p>
      )}
      <SprigDivider className="mt-5" />
      {description && <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
    </div>
  )
}
