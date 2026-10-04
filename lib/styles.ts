import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ctaBase = 'h-11 rounded-sm px-6 text-[0.7rem] font-medium tracking-[0.2em] uppercase'

export const primaryCta = cn(buttonVariants({ variant: 'default' }), ctaBase, 'hover:bg-olive-deep')

export const outlineCta = cn(
  buttonVariants({ variant: 'outline' }),
  ctaBase,
  'border-olive/60 bg-transparent text-olive-deep hover:bg-olive hover:text-primary-foreground',
)
