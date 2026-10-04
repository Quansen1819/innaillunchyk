import type { SVGProps } from 'react'

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function EtsyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8.56 4.27c0-.25.03-.4.47-.4h5.98c1.04 0 1.62.89 2.04 2.56l.33 1.33h1.02c.18-3.78.34-5.42.34-5.42s-2.55.29-4.07.29H6.98L2.88 2.5v1.1l1.38.26c.97.19 1.2.39 1.28 1.28 0 0 .09 2.63.09 6.96s-.07 6.93-.07 6.93c0 .78-.31 1.07-1.28 1.26l-1.38.27v1.1l4.11-.13h6.86c1.55 0 5.13.13 5.13.13.08-.94.6-5.21.68-5.68h-.96l-1.03 2.33c-.81 1.83-2 1.96-3.32 1.96H10.4c-1.31 0-1.94-.52-1.94-1.65v-5.87s2.9 0 3.84.08c.73.05 1.17.26 1.41 1.28l.31 1.36h1.12l-.07-3.43.16-3.46h-1.12l-.37 1.52c-.23 1-.39 1.18-1.41 1.28-1.34.13-3.87.11-3.87.11V4.27Z" />
    </svg>
  )
}
