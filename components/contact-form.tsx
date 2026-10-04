'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactValues } from '@/lib/contact-schema'
import { primaryCta } from '@/lib/styles'
import { cn } from '@/lib/utils'

const fieldClass =
  'h-11 rounded-sm border-input bg-card/70 px-3.5 text-[0.95rem] placeholder:text-muted-foreground/70 focus-visible:ring-olive/30'

export function ContactForm({ paintingTitles }: { paintingTitles: Record<string, string> }) {
  const searchParams = useSearchParams()
  const paintingSlug = searchParams.get('painting')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', painting: '', message: '', website: '' },
  })

  useEffect(() => {
    const title = paintingSlug ? paintingTitles[paintingSlug] : undefined
    if (!title) return
    setValue('painting', title)
    setValue('message', `Hello Inna, I'm interested in "${title}". Is it still available?`)
    setFocus('name')
  }, [paintingSlug, paintingTitles, setValue, setFocus])

  const onSubmit = async (values: ContactValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      toast.success('Thank you for your message!', {
        description: 'Inna will get back to you within a few days.',
      })
      reset()
    } catch (err) {
      toast.error('Message not sent', {
        description: err instanceof Error ? err.message : 'Please try again later.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={fieldClass} {...register('name')} />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={fieldClass} {...register('email')} />
        </Field>
      </div>

      <Field id="painting" label="Painting of interest" hint="Optional" error={errors.painting?.message}>
        <Input id="painting" placeholder="e.g. Spring Awakening" className={fieldClass} {...register('painting')} />
      </Field>

      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(fieldClass, 'h-auto min-h-36 py-3')}
          {...register('message')}
        />
      </Field>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <button type="submit" disabled={isSubmitting} className={cn(primaryCta, 'w-full sm:w-auto sm:px-10')}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[0.7rem] font-medium tracking-[0.18em] text-charcoal/80 uppercase">
        {label}
        {hint && <span className="ml-1 tracking-normal text-muted-foreground normal-case">({hint})</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
