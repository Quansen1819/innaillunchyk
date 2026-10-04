import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'
import { siteConfig } from '@/lib/site'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form fields and try again.' }, { status: 422 })
  }

  const { name, email, painting, message, website } = parsed.data

  // Honeypot filled: pretend success so bots learn nothing.
  if (website) return NextResponse.json({ ok: true })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] RESEND_API_KEY missing — message not sent:', { name, email, painting })
      return NextResponse.json({ ok: true, delivered: false })
    }
    return NextResponse.json({ error: 'Email is not configured yet. Please write directly to ' + siteConfig.email }, { status: 503 })
  }

  const resend = new Resend(apiKey)
  const subject = painting ? `Inquiry about "${painting}" from ${name}` : `New message from ${name}`
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    painting ? `Painting: ${painting}` : null,
    '',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? 'Inna Iliychuk Art <onboarding@resend.dev>',
    to: process.env.CONTACT_TO_EMAIL ?? siteConfig.email,
    replyTo: email,
    subject,
    text,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json({ error: 'Sorry, your message could not be sent. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
