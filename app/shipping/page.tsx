import type { Metadata } from 'next'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'How original oil paintings by Inna Iliychuk are packed, shipped and insured from Chicago.',
}

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Good to know"
      title="Shipping & Returns"
      script="Packed with care"
      ctaLabel="Ask a question"
      sections={[
        {
          heading: 'Packing',
          body: 'Every painting is wrapped in glassine paper, protected with foam corners and boxed by hand in my Chicago studio. Each one is signed and arrives with a certificate of authenticity.',
        },
        {
          heading: 'Shipping',
          body: 'Paintings ship insured within 3–5 business days of purchase, with tracking. Local pickup in the Chicago area is welcome; just send me a message.',
        },
        {
          heading: 'Returns',
          body: 'If a painting arrives damaged or is not right for your home, contact me within 14 days of delivery and we will find a solution together.',
        },
      ]}
    />
  )
}
