import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.email('Please enter a valid email address').max(200),
  painting: z.string().trim().max(150).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Please write a few words (at least 10 characters)')
    .max(3000, 'Message is too long'),
  website: z.string().max(500).optional(),
})

export type ContactValues = z.infer<typeof contactSchema>
