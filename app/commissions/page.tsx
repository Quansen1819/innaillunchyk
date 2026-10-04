import type { Metadata } from 'next'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: 'Commissions',
  description: 'Commission an original oil painting by Inna Iliychuk: landscapes, florals and still life painted for your home.',
}

export default function CommissionsPage() {
  return (
    <InfoPage
      eyebrow="Made for you"
      title="Commissions"
      script="A painting with your story"
      ctaLabel="Start a commission"
      sections={[
        {
          heading: 'How it works',
          body: 'Tell me about the place, flowers or memory you would like to see on canvas, along with the size and colors of your room. I will reply with ideas, a quote and a timeline. Once we agree, I begin with a small color sketch for your approval.',
        },
        {
          heading: 'Sizes & pricing',
          body: 'Commissions start at 12 × 16 in. Pricing depends on size and detail and is similar to my available originals. A 50% deposit reserves your spot in my schedule.',
        },
        {
          heading: 'Timeline',
          body: 'Oil paint needs time. Most commissions take 4–8 weeks to paint and dry properly before varnishing and shipping. I will send progress photos along the way.',
        },
      ]}
    />
  )
}
